const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    valid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = { SessionModel: mongoose.model("sessions", Schema) };
