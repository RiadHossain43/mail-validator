const { logger } = require("../common/helper");
module.exports = {
  handleSocket: function (httpServer) {
    const socket = require("../.config/webSocket").init(httpServer);
    socket.on("connection", (client) => {
      logger.info("socket io client connected.", { clientId: client.id });
      require("../emailvalidations/services/socket/validation.subscriber")(client);
      client.on("disconnect", () =>
        logger.info("socket io client disconnected.", { clientId: client.id })
      );
    });
  },
};
