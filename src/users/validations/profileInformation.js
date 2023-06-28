const Joi = require("joi");
const { fileMetaInfo } = require("../../common/validations/fileMetaInfo");
const schema = Joi.object({
  name: Joi.string().required().label("Name"),
  organisationName: Joi.string().optional().allow("").label("organisationName"),
  jobTitle: Joi.string().optional().allow("").label("jobTitle"),
});
module.exports = {
  updateProfileData: schema,
  updateProfileImage: fileMetaInfo,
};
