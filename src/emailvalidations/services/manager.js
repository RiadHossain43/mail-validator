const { EmailValidations } = require("../../models/emailValidation");
class Manager {
  constructor() {
    this.EmailValidations = EmailValidations;
  }
}
module.exports = { Manager };
