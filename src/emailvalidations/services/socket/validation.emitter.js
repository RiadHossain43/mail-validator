const webSocket = require("../../../.config/webSocket");
const { logger } = require("../../../common/helper");
module.exports = {
  push: function (data) {
    logger.info(
      "pushing validation result information to -> " +
        data.user.name +
        " " +
        data.user._id
    );
    webSocket.isSet() &&
      webSocket
        .getSocket()
        .to(data.user._id.toString())
        .emit("new-validation-result", data);
  },
};
