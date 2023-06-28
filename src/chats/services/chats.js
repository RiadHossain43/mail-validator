const { APIError } = require("../../common/helper/error/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class ChatsCRUD extends Manager {
  constructor() {
    super();
  }
  async createChat(data) {
    const chat = new this.Chats({
      chathead: data.chathead,
      prompt: data.prompt,
      response: data.response,
    });
    return chat.save();
  }
  async getChat(query) {
    const chat = await this.Chats.findOne(query);
    if (!chat)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No chat found with the given query."
      );
    return chat;
  }
  async listChats(query, options) {
    let pagination = await this.Chats.paginate(query, options);
    return pagination;
  }
  async editChat(id, data) {
    const chat = await this.getChat({ _id: id });
    return chat.save();
  }
  async softRemoveChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chats.softDelete({ _id: id });
      return chat;
    }
  }
  async hardRemoveChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chats.deleteOne({ _id: id });
      return chat;
    }
  }
  async restoreChat(id) {
    const chat = await this.getChat({ _id: id });
    if (chat) {
      await this.Chats.restore({ _id: id });
      return chat;
    }
  }
}
module.exports = { ChatsCRUD };
