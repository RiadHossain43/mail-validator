const { ReasonPhrases, StatusCodes } = require("http-status-codes");
const { stripe } = require("../../.config/stripe");
const { APIError } = require("../../common/helper/error/apiError");
const { subscriptionStatuses } = require("../../models/user");
const { Manager } = require("./manager");
const { logger } = require("../../common/helper");

class Subscription extends Manager {
  constructor() {
    super();
  }
  async listPaymentHistory(paymentInformation) {
    const subscription = await stripe.subscriptions.retrieve(
      paymentInformation.subscriptionId
    );
    const paymentHistory = await stripe.invoices.list({
      customer: paymentInformation.customerId,
      limit: 100,
    });
    return {
      subscription,
      payments: paymentHistory.data,
    };
  }
  async subscribe(data) {
    const customer = await stripe.customers.create({
      name: data.user.name,
      email: data.user.email,
      test_clock: "clock_1NDTxiKkFnfZvhOn94ug9oNf",
    });
    logger.info("customer created:", customer.id);
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: data.cardNumber,
        exp_month: data.cardExpMonth,
        exp_year: data.cardExpYear,
        cvc: data.cardCvc,
      },
    });
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
    logger.info("payment method created:", paymentMethod.id);
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_ALICE_PRICE }],
    });
    logger.info("subscription created", subscription.id);
    return {
      subscription,
      paymentMethod,
      customer,
    };
  }
  async updatePaymentMethod(paymentInformation, data) {
    await stripe.paymentMethods.detach(paymentInformation.paymentMethodId);
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: data.cardNumber,
        exp_month: data.cardExpMonth,
        exp_year: data.cardExpYear,
        cvc: data.cardCvc,
      },
    });
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: paymentInformation.customerId,
    });
    await stripe.customers.update(paymentInformation.customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
    return paymentMethod;
  }
  async unsubscribe(paymentInformation) {
    /** order of api calls matters here  */
    let subscription = await stripe.subscriptions.del(
      paymentInformation.subscriptionId
    );
    await stripe.paymentMethods.detach(paymentInformation.paymentMethodId);
    await stripe.customers.del(paymentInformation.customerId);
    return subscription;
  }
  async createBillingPortalSession(user) {
    if (!user.paymentInformation?.customerId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User does not have a custommer id."
      );
    return stripe.billingPortal.sessions.create({
      customer: user.paymentInformation?.customerId,
      return_url: process.env.CLIENT_URL + "/payments/check-information",
    });
  }
}
module.exports = { Subscription };
