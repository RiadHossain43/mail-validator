const { UserModel } = require("../../models/user");
class Manager {
  constructor() {
    this.User = UserModel;
  }
}
module.exports = { Manager };
