const { Token } = require("../helper/token");
const { APIError } = require("../../common/helper/error/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { logger } = require("../helper");
const userDeserialization = async (req, res, next) => {
  const accessToken = req.header("x-auth-accesstoken");
  try {
    if (!accessToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "No access token found."
      );
    const validationResponse = await Token.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      throw new APIError(
        ReasonPhrases.UNAUTHORIZED,
        StatusCodes.UNAUTHORIZED,
        "Invalid access token."
      );
    }
    /** user authenticated proceed to next middleware */
    if (validationResponse.decoded) {
      req.accessControl = {
        user: validationResponse.decoded.user,
      };
      return next();
    }
    logger.error("Unknown authorization error!");
    return res
      .status(440)
      .json({ message: "Unknown authorization error!", details: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = userDeserialization;
