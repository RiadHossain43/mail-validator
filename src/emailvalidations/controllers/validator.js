const { StatusCodes } = require("http-status-codes");
const { Validator } = require("../services");
exports.startValidation = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      user: req.accessControl.user,
    };
    const emailValidatorService = new Validator();
    await emailValidatorService.startValidation(data);
    return res.status(StatusCodes.OK).json({
      message: "Email validation started.",
      details: { ...data },
    });
  } catch (error) {
    next(error);
  }
};
