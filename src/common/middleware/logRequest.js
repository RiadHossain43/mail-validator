const { logger } = require("../helper");

exports.logRequest = async (req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    logger.info("request information", {
      usedAccessToken: req.header("x-auth-accesstoken"),
      requestMethod: req.method,
      host: req.headers.origin,
      endPoint: req.originalUrl,
      requestBody: req.body,
    });
  }
  next();
};
