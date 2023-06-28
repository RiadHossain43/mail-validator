const Joi = require("joi");
const schema = Joi.object({
  nameOnCard: Joi.string().max(100).required().label("Name"),
  cardNumber: Joi.number().required().label("Card number"),
  cardCvc: Joi.number().required().label("CVC"),
  cardExpMonth: Joi.number().required().label("Expiry month"),
  cardExpYear: Joi.number().required().label("Expiry year"),
});
const create = schema;
const update = schema;
module.exports = {
  create,
  update,
};
