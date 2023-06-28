const Joi = require("joi");

const gpt3_5InputStructureValidation = Joi.object({
  role: Joi.string().valid("system", "assistant", "user").label("role"),
  content: Joi.string().optional().label("content"),
});

const textquery = Joi.object({
  prompt: Joi.string().required().label("Prompt"),
  systemInstructions: Joi.array()
    .items(gpt3_5InputStructureValidation)
    .required()
    .label("Conversation"),
  conversation: Joi.array()
    .required()
    .items(gpt3_5InputStructureValidation)
    .label("Conversation"),
});
const imagequery = Joi.object({
  prompt: Joi.string().required().label("Prompt"),
  n: Joi.number().min(1).max(10).required().label("n"),
  size: Joi.string()
    .required()
    .valid("256x256", "512x512", "1024x1024")
    .label("Conversation"),
});
module.exports = {
  textquery,
  imagequery,
};
