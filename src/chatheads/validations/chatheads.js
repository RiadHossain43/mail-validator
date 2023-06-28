const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().max(200).required().label("name"),
  description: Joi.string().optional().allow("").label("description"),
});
const createChathead = schema;
const editChathead = schema;
module.exports = {
  createChathead,
  editChathead,
};
