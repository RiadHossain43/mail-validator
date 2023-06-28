const { Recovery } = require("../services");
const { StatusCodes } = require("http-status-codes");

exports.startAccountRecovery = async (req, res, next) => {
  try {
    const recoveryService = new Recovery();
    const recovery = await recoveryService.startAccountRecovery(req.body.email);
    res.status(StatusCodes.OK).json({
      message: "Recovery email sent for verification.",
      details: { ...recovery },
    });
  } catch (error) {
    next(error);
  }
};
exports.recoverAccount = async (req, res, next) => {
  try {
    const token = req.header("x-recovery-token");
    const recoveryService = new Recovery();
    const user = await recoveryService.recoverAccount(token, req.body.password);
    res.status(StatusCodes.OK).json({
      message: "Account recovered.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
