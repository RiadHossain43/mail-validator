const { UserModel } = require("../../models/user");
const { SessionModel } = require("../../models/session");

class Manager {
  constructor() {
    this.User = UserModel;
    this.Session = SessionModel;
  }
}
module.exports = { Manager };
