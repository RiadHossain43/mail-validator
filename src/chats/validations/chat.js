const Joi = require("joi");
const { reactions } = require("../../models/chats");
const schema = Joi.object({
  chathead: Joi.string().required().label("chathead"),
  prompt: Joi.string().required().label("prompt"),
  response: Joi.string().optional().label("response"),
  // images: Joi.array()
  //   .optional()
  //   .items(
  //     Joi.object({
  //       isOriginal: Joi.string().label("isOriginal"),
  //       url: Joi.string().label("url"),
  //     })
  //   )
  //   .label("response"),
});
const createChat = schema;
const editChat = schema;
const reactOnChat = Joi.object({
  reaction: Joi.string()
    .required()
    .valid(...Object.values(reactions))
    .label("reaction"),
});
module.exports = {
  createChat,
  editChat,
  reactOnChat,
};
