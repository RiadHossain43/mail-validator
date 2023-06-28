const { StatusCodes } = require("http-status-codes");
const { ChatsCRUD, ReactionManager } = require("../services");
const { Filters, formatListResponse } = require("../../common/helper");
exports.createChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const data = {
      ...req.body,
      author: req.accessControl.user?._id,
    };
    const chat = await chatsService.createChat(data);
    return res.status(StatusCodes.CREATED).json({
      message: "Chat created.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.listChats = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["prompt", "response"],
    })
      .build()
      .query();
    let query = { ...filter };
    const chatsService = new ChatsCRUD();
    const result = await chatsService.listChats(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Chats retrived.",
      details: {
        chats: formatListResponse(result).data,
        pagination: formatListResponse(result).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const chat = await chatsService.getChat({
      _id: req.params.id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Chat retrived.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.editChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const chat = await chatsService.editChat(req.params.id, req.body);
    return res.status(StatusCodes.OK).json({
      message: "Chat updated.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.softRemoveChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const chat = await chatsService.softRemoveChat(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chat moved to trash.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.restoreChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const chat = await chatsService.restoreChat(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chat restored.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.hardRemoveChat = async (req, res, next) => {
  try {
    const chatsService = new ChatsCRUD();
    const chat = await chatsService.hardRemoveChat(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chat removed.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
exports.react = async (req, res, next) => {
  try {
    const reactionManager = new ReactionManager();
    const chat = await reactionManager.react(req.params.id, req.body);
    return res.status(StatusCodes.OK).json({
      message: "Reaction added.",
      details: { chat },
    });
  } catch (error) {
    next(error);
  }
};
