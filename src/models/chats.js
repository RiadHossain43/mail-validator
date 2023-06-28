const mongoose = require("mongoose");
const { softDeletePlugin } = require("./plugins/softDelete");
const mongoosePaginate = require("mongoose-paginate-v2");
const reactions = {
  EMPTY: "Empty",
  LIKE: "Like",
  INSIGHTFUL: "Insightful",
  EXCELLENT: "Excellent",
  DISLIKE: "Dislike",
};
const Schema = new mongoose.Schema(
  {
    chathead: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "charheads",
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    response: {
      type: String,
    },
    images: {
      type: [
        {
          isOriginal: {
            type: Boolean,
            default: false,
          },
          url: String,
        },
      ],
    },
    reaction: {
      type: String,
      enum: Object.values(reactions),
    },
  },
  { timestamps: true }
);
Schema.plugin(softDeletePlugin);
Schema.plugin(mongoosePaginate);
module.exports = { ChatModel: mongoose.model("chats", Schema), reactions };
