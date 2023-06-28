const Joi = require("joi");
const { activityStatuses } = require("../../models/user");
const schema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(activityStatuses))
    .required()
    .label("status"),
});
module.exports = {
  activityStatus: schema,
};
