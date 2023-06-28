const { APIError } = require("../../common/helper/error/apiError");
const { User } = require("./users");
const { subscriptionStatuses } = require("../../models/user");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class PaymentInformation extends User {
  constructor() {
    super();
  }
  async attachFullPaymentInformation(id, data) {
    if (!data.customerId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Customer id not proided."
      );
    if (!data.paymentMethodId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Payment method id not proided."
      );
    if (!data.subscriptionId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Subscription id not proided."
      );
    let user = await this.getUser({ _id: id });
    user = await this.User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          subscriptionInformation: {
            status: subscriptionStatuses.SUBSCRIBED,
            endsAfter: null,
          },
          paymentInformation: {
            customerId: data.customerId,
            subscriptionId: data.subscriptionId,
            paymentMethodId: data.paymentMethodId,
          },
        },
      },
      { new: true }
    );
    return user;
  }
  async updatePaymentMethodId(id, data) {
    let user = await this.getUser({ _id: id });
    user = await this.User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          "paymentInformation.paymentMethodId": data.paymentMethodId,
        },
      },
      { new: true }
    );
    return user;
  }
  async updateSubscriptionId(id, data) {
    let user = await this.getUser({ _id: id });
    user = await this.User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          "paymentInformation.subscriptionId": data.subscriptionId,
        },
      },
      { new: true }
    );
    return user;
  }
  async updateCustomerId(id, data) {
    let user = await this.getUser({ _id: id });
    user = await this.User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          "paymentInformation.customerId": data.customerId,
        },
      },
      { new: true }
    );
    return user;
  }
  async updateSubscriptionStatus(id, data) {
    let user = await this.getUser({ _id: id });
    user = await this.User.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          subscriptionInformation: {
            status: data.status,
            endsAfter: null,
          },
        },
      },
      { new: true }
    );
    return user;
  }
  async hasPaymentInformationSet(id) {
    let user = await this.getUser({ _id: id });
    if (!user.paymentInformation.customerId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This user has no proper paid customer id."
      );
    if (!user.paymentInformation.paymentMethodId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This user has no proper payment method."
      );
    if (!user.paymentInformation.subscriptionId)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "This user has no proper subscription id."
      );
    return user;
  }
}
module.exports = { PaymentInformation };
