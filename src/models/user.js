const mongoose = require("mongoose");
const { softDeletePlugin } = require("./plugins/softDelete");
const { fileMetaInfo } = require("./templates/fileMetaInfo");
const subscriptionStatuses = {
  FREE: "Free",
  UNSUBSCRIBED: "Unsubscribed",
  SUBSCRIBED: "Subscribed",
  TRIAL: "Trial",
};
const activityStatuses = {
  AWAY: "Away",
  ACTIVE: "Active",
  NEVER: "Never",
};
/**
 *
 * @param {mongoose.Schema} schema
 */
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    organisationName: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      src: String,
      metaInfo: fileMetaInfo,
    },
    emailVerification: {
      token: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: ["Verified", "Pending"],
        default: "Pending",
      },
      verificationDate: {
        type: Date,
        default: null,
      },
    },
    refreshTokens: [String],
    recoveryToken: {
      type: String,
      default: "",
    },
    /** this is a automated field to be controlled through plugin */
    subscriptionInformation: {
      status: {
        type: String,
        enum: [
          subscriptionStatuses.SUBSCRIBED,
          subscriptionStatuses.UNSUBSCRIBED,
          subscriptionStatuses.TRIAL,
          subscriptionStatuses.FREE,
        ],
        default: subscriptionStatuses.TRIAL,
      },
      endsAfter: Date,
    },
    paymentInformation: {
      customerId: {
        type: String,
        default: "",
      },
      paymentMethodId: {
        type: String,
        default: "",
      },
      subscriptionId: {
        type: String,
        default: "",
      },
    },
    activity: {
      status: {
        type: String,
        enum: [
          activityStatuses.NEVER,
          activityStatuses.AWAY,
          activityStatuses.ACTIVE,
        ],
        default: activityStatuses.NEVER,
      },
      lastSeen: Date,
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
module.exports = {
  UserModel: mongoose.model("users", Schema),
  subscriptionStatuses,
  activityStatuses,
};
