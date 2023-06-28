const { Subscription, Pricing } = require("../services");
const userServices = require("../../users/services");
const { subscriptionStatuses } = require("../../models/user");
const { stripe } = require("../../.config/stripe");
const { logger } = require("../../common/helper");
exports.subscribe = async (req, res, next) => {
  let userCrudOps = new userServices.User();
  let userPayment = new userServices.PaymentInformation();
  let subscriptionservice = new Subscription();
  try {
    let user = await userCrudOps.getUser({ _id: req.accessControl.user?._id });
    let subscriptionDetails = {
      user,
      ...req.body,
    };
    let informaion = await subscriptionservice.subscribe(subscriptionDetails);
    user = await userPayment.attachFullPaymentInformation(user._id, {
      customerId: informaion.customer.id,
      subscriptionId: informaion.subscription.id,
      paymentMethodId: informaion.paymentMethod.id,
    });
    res.status(200).json({
      message: "Subscription added.",
      details: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.listPaymentHistory = async (req, res, next) => {
  let userCrudOps = new userServices.User();
  let subscriptionservice = new Subscription();
  try {
    let user = await userCrudOps.getUser({ _id: req.accessControl.user?._id });
    let history = await subscriptionservice.listPaymentHistory(
      user.paymentInformation
    );
    res.status(200).json({
      message: "Subscription history retrived.",
      details: {
        ...history,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getPricingInformation = async (req, res, next) => {
  let pricing = new Pricing();
  try {
    let stripePricingInformation = await pricing.getPricingInformation();
    res.status(200).json({
      message: "Subscription added.",
      details: {
        stripePricingInformation,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.manageSubscription = async (req, res, next) => {
  let subscriptionservice = new Subscription();
  let userCrudOps = new userServices.User();
  try {
    let user = await userCrudOps.getUser({ _id: req.accessControl.user?._id });
    let session = await subscriptionservice.createBillingPortalSession(user);
    res.status(200).json({
      message: "Url retrived",
      details: {
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.updateCardDetails = async (req, res, next) => {
  let userPayment = new userServices.PaymentInformation();
  let subscriptionservice = new Subscription();
  try {
    let user = await userPayment.hasPaymentInformationSet(
      req.accessControl.user?._id
    );
    let paymentDetails = {
      ...req.body,
    };
    let paymentMethod = await subscriptionservice.updatePaymentMethod(
      user.paymentInformation,
      paymentDetails
    );
    user = await userPayment.updatePaymentMethodId(user?._id, {
      paymentMethodId: paymentMethod.id,
    });
    res.status(200).json({
      message: "Subscription added.",
      details: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.cancel = async (req, res, next) => {
  let userCrudOps = new userServices.User();
  let subscriptionservice = new Subscription();
  try {
    let user = await userCrudOps.getUser({ _id: req.accessControl.user?._id });
    let subscription = await subscriptionservice.unsubscribe(
      user.paymentInformation
    );
    let cancelDate = new Date(0);
    cancelDate = cancelDate.setUTCSeconds(subscription.canceled_at);
    user = await userCrudOps.scheduleDeactivation(user._id, {
      date: new Date(cancelDate),
    });
    res.status(200).json({
      message: "Subscription will be canceled.",
      details: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.paymentWebhook = async (req, res, next) => {
  let userPayment = new userServices.PaymentInformation();
  let userCrudOps = new userServices.User();
  try {
    const stripeSignature = req.headers["stripe-signature"];
    let event = req.body;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error(err.message, err.stack);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    switch (event.type) {
      case "customer.created": {
        let user = await userCrudOps.getUser({
          email: event?.data?.object?.email,
        });
        user = await userPayment.updateCustomerId(user._id, {
          customerId: event?.data?.object?.id,
        });
        user = await userPayment.updateSubscriptionStatus(user._id, {
          status: subscriptionStatuses.SUBSCRIBED,
        });
        break;
      }
      case "customer.subscription.updated": {
        let user = await userCrudOps.getUser({
          "paymentInformation.customerId": event?.data?.object?.customer,
        });
        let status = event?.data?.object?.cancel_at
          ? subscriptionStatuses.UNSUBSCRIBED
          : subscriptionStatuses.SUBSCRIBED;
        user = await userPayment.updateSubscriptionStatus(user._id, { status });
        break;
      }
      default:
        logger.error(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({
      received: true,
    });
  } catch (error) {
    next(error);
  }
};
