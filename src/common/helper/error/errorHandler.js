const { logger } = require("../logger");
const { APIError } = require("./apiError");
class ErroHandler {
  constructor(error) {
    this.error = error;
  }
  handleError() {
    logger.error(
      "Logging error handler: ******************************************"
    );
    logger.error(this.error?.message);
    logger.error(this.error?.stack);
    logger.error(
      "*****************************************************************"
    );
  }
  isTrustedAPIError() {
    if (this.error instanceof APIError) {
      return this.error.isOperational;
    }
    return false;
  }
}
module.exports = ErroHandler;
