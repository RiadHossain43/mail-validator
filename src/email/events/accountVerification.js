module.exports = async (config) => {
  let template = await require("../../common/helper/template").createTemplate({
    view: "emailTemplates/accessControl/accountVerification.ejs",
    templateOptions: config.payload,
  });
  return {
    subject: config.subject || "Verify your account",
    template,
  };
};
