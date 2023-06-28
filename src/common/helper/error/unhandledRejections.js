const { logger } = require("../logger");
const ErrorHandler = require("./errorHandler");
const actionOnUnhandled = () => {
  process.on("unhandledRejection", (error, promise) => {
    logger.error("soft handling rejections ");
    let errorHandler = new ErrorHandler(error);
    errorHandler.handleError();
  });
  process.on("uncaughtException", (error) => {
    logger.error("soft handling rejections ");
    let errorHandler = new ErrorHandler(error);
    errorHandler.handleError();
  });
};
module.exports = {
  actionOnUnhandled,
};
