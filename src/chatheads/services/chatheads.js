const { APIError } = require("../../common/helper/error/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class ChatheadsCRUD extends Manager {
  constructor() {
    super();
  }
  async createChathead(data) {
    const chathead = new this.Chatheads({
      metaData: {
        name: data.name,
        description: data.description,
        author: data.author,
      },
    });
    return chathead.save();
  }
  async getChathead(query) {
    const chathead = await this.Chatheads.findOne(query);
    if (!chathead)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No chathead found with the given query."
      );
    return chathead;
  }
  async listChatheads(query, options) {
    let pagination = await this.Chatheads.paginate(query, options);
    return pagination;
  }
  async editChathead(id, data) {
    const chathead = await this.getChathead({ _id: id });
    chathead.metaData.name = data.name;
    chathead.metaData.description = data.description;
    return chathead.save();
  }
  async softRemoveChathead(id) {
    const chathead = await this.getChathead({ _id: id });
    if (chathead) {
      await this.Chatheads.softDelete({ _id: id });
      return chathead;
    }
  }
  async hardRemoveChathead(id) {
    const chathead = await this.getChathead({ _id: id });
    if (chathead) {
      await this.Chats.deleteMany({ chathead: id });
      await this.Chatheads.deleteOne({ _id: id });
      return chathead;
    }
  }
  async restoreChathead(id) {
    const chathead = await this.getChathead({ _id: id });
    if (chathead) {
      await this.Chatheads.restore({ _id: id });
      return chathead;
    }
  }
}
module.exports = { ChatheadsCRUD };
