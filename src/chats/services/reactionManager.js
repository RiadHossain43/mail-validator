const { ChatsCRUD } = require("./chats");
class ReactionManager extends ChatsCRUD {
  constructor() {
    super();
  }
  async react(id, data) {
    let chat = await this.getChat({ _id: id });
    chat.reaction = data.reaction;
    return chat.save();
  }
}
module.exports = { ReactionManager };
