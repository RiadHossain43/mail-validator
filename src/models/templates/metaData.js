const mongoose = require("mongoose");
const metaData = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};
module.exports = { metaData };
