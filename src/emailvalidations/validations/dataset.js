const Joi = require("joi");
const schema = Joi.object({
  email: Joi.string().required().label("email"),
  score: Joi.number().required().min(0).max(100).label("score"),
  validDomain: Joi.boolean().required().label("validDomain"),
  validFormat: Joi.boolean().required().label("validFormat"),
  validMailbox: Joi.boolean().required().label("validMailbox"),
  validMXRecord: Joi.boolean().required().label("validMXRecord"),
  isBlackListed: Joi.boolean().required().label("isBlackListed"),
  isDisposable: Joi.boolean().required().label("isDisposable"),
  isFree: Joi.boolean().required().label("isFree"),
});
const createEmailValidationRecords = Joi.object({
  records: Joi.array().max(500).items(schema).required().label("records"),
});
const editEmailValidationRecord = schema;
const bulkActionEmailValidationRecords = Joi.object({
  records: Joi.array()
    .max(500)
    .items(Joi.string().required("item"))
    .required()
    .label("records"),
});
const validationSet = Joi.object({
  records: Joi.array()
    .max(500)
    .items(Joi.string().email().required("item"))
    .required()
    .label("records"),
});
module.exports = {
  createEmailValidationRecords,
  editEmailValidationRecord,
  bulkActionEmailValidationRecords,
  validationSet,
};
