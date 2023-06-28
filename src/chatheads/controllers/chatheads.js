const { Filters, formatListResponse } = require("../../common/helper");
const { ChatheadsCRUD } = require("../services");
const { StatusCodes } = require("http-status-codes");
exports.createChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const data = {
      ...req.body,
      author: req.accessControl.user?._id,
    };
    const chathead = await chatheadService.createChathead(data);
    return res.status(StatusCodes.CREATED).json({
      message: "Chathead created.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.listChatheads = async (req, res, next) => {
  try {
    let { page, sort, size } = req.query;
    const options = { page, limit: size, sort };
    let filter = new Filters(req, {
      searchFields: ["metaData.title", "metaData.description"],
    })
      .build()
      .query();
    let query = { ...filter, "metaData.author": req.accessControl.user?._id };
    const chatheadService = new ChatheadsCRUD();
    const results = await chatheadService.listChatheads(query, options);
    return res.status(StatusCodes.OK).json({
      message: "Chatheads retrived.",
      details: {
        chatheads: formatListResponse(results).data,
        pagination: formatListResponse(results).pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.getChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const chathead = await chatheadService.getChathead({
      _id: req.params.id,
    });
    return res.status(StatusCodes.OK).json({
      message: "Chathead retrived.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.editChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const chathead = await chatheadService.editChathead(
      req.params.id,
      req.body
    );
    return res.status(StatusCodes.OK).json({
      message: "Chathead updated.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.softRemoveChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const chathead = await chatheadService.softRemoveChathead(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chathead moved to trash.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.restoreChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const chathead = await chatheadService.restoreChathead(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chathead restored.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
exports.hardRemoveChathead = async (req, res, next) => {
  try {
    const chatheadService = new ChatheadsCRUD();
    const chathead = await chatheadService.hardRemoveChathead(req.params.id);
    return res.status(StatusCodes.OK).json({
      message: "Chathead removed.",
      details: { chathead },
    });
  } catch (error) {
    next(error);
  }
};
