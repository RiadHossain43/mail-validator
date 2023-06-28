const mongoose = require("mongoose");
const { softDeletePlugin } = require("./plugins/softDelete");
const { metaData } = require("./templates/metaData");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = new mongoose.Schema(
  {
    metaData,
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(mongoosePaginate);
module.exports = { ChatheadModel: mongoose.model("chatheads", Schema) };
