const { ChatheadModel } = require("../../models/chatheads");
const { ChatModel } = require("../../models/chats");
class Manager {
  constructor() {
    this.Chatheads = ChatheadModel;
    this.Chats = ChatModel;
  }
}
module.exports = { Manager };
