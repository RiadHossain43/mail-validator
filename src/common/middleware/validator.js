const { APIError } = require("../helper/error/apiError");
const { Validation } = require("../helper/validation");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const validate =
  (validationObjectName) => (schema) => async (req, res, next) => {
    try {
      const validation = new Validation(req.tenant);
      const errors = validation.validate(schema, req[validationObjectName]);
      if (errors) {
        throw new APIError(
          ReasonPhrases.BAD_REQUEST,
          StatusCodes.BAD_REQUEST,
          /** we are trying to send the top error as the message. */
          Array.from(Object.values(errors))[0] ||
            `Request ${validationObjectName} validation error.`
        );
      }
      next()
    } catch (err) {
      next(err);
    }
  };
exports.validate = validate;
