const webSocket = require("../../../.config/webSocket");
const { logger } = require("../../../common/helper");
module.exports = function (client) {
  client.on("validation-subscription", (data) => {
    if (data.subscriptionFilter) {
      client.join(data.subscriptionFilter._id);
      webSocket
        .getSocket()
        .to(data.subscriptionFilter._id)
        .emit("validation-subscription-response", data.subscriptionFilter);
      logger.info(
        `${data.subscriptionFilter.name} with uid: ${data.subscriptionFilter._id} has subscribed with scoket: ${client.id} for email validation.`
      );
    }
  });
};
