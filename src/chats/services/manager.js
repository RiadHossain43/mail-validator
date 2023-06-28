const { ChatModel } = require("../../models/chats");
class Manager {
  constructor() {
    this.Chats = ChatModel;
  }
}
module.exports = { Manager };
