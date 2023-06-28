const mongoose = require("mongoose");
const { softDeletePlugin } = require("./plugins/softDelete");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    validFormat: {
      type: Boolean,
      default: false,
    },
    validMXRecord: {
      type: Boolean,
      default: false,
    },
    validDomain: {
      type: Boolean,
      default: false,
    },
    validMailbox: {
      type: Boolean,
      default: false,
    },
    isDisposable: {
      type: Boolean,
      default: false,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    isBlackListed: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(mongoosePaginate);
module.exports = {
  EmailValidations: mongoose.model("emailvalidations", Schema),
};
