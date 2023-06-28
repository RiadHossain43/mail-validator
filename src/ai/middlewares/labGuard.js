const { APIError } = require("../../common/helper/error/apiError");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");
exports.labGuard = async (req, res, next) => {
  if (process.env.NODE_ENV === "development") return next();
  throw new APIError(
    ReasonPhrases.UNAUTHORIZED,
    StatusCodes.UNAUTHORIZED,
    "Unauthorised to access lab."
  );
};
