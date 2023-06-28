const mongoose = require("mongoose");
const { permissions } = require("./templates/permissions");
const { role } = require("./templates/roles");
const Schema = new mongoose.Schema(
  {
    workspaceRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "workspaces",
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    permissions: {
      type: mongoose.Schema.Types.Mixed,
      enum: [permissions, role],
    },
  },
  { timestamps: true }
);
module.exports = {
  AccessPoliciesModel: mongoose.model("access_policies", Schema),
};
