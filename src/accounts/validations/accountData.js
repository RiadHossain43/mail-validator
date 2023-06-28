const Joi = require("joi");
const emailTemplate = Joi.string().max(50).email().required().label("Email");
const passwordTemplate = Joi.string()
  .min(8)
  .max(50)
  .required()
  .label("Password");

const register = Joi.object({
  name: Joi.string().max(20).required().label("Name"),
  email: emailTemplate,
  password: passwordTemplate,
});
const login = Joi.object({
  email: emailTemplate,
  password: passwordTemplate,
});
const requestRecovery = Joi.object({
  email: emailTemplate,
});
const verifyRecovery = Joi.object({
  password: passwordTemplate,
});
const resedVerification = Joi.object({
  userId: Joi.string().required().label("User id"),
});
module.exports = {
  register,
  login,
  requestRecovery,
  verifyRecovery,
  resedVerification,
};
