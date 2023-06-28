const { logger } = require("../../common/helper");
const { Auth } = require("../services");
const { StatusCodes } = require("http-status-codes");
exports.login = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { email, password } = req.body;
    const authService = new Auth();
    const authResponse = await authService.authenticateIdentity({
      availableToken: cookies.__imsrt__,
      email,
      password,
      userAgent: req.get("user-agent") || "",
    });
    if (cookies.__imsrt__) {
      logger.info("found cookie in login. clearing now...");
      res.clearCookie("__imsrt__", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }
    res.cookie("__imsrt__", authResponse.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.OK).json({
      message: "Login successfull.",
      details: { ...authResponse },
    });
  } catch (error) {
    next(error);
  }
};
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.__imsrt__ || req.header("x-auth-refreshtoken");
    const authService = new Auth();
    const newTokens = await authService.handleRefreshToken(refreshToken);
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.cookie("__imsrt__", newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(StatusCodes.OK).json({
      message: "New pair of newTokens granted.",
      details: { tokenRefresh: true, ...newTokens },
    });
  } catch (error) {
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    next(error);
  }
};
exports.logout = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.__imsrt__ || req.header("x-auth-refreshtoken");
    const authService = new Auth();
    const user = await authService.invalidateRefreshToken(refreshToken);
    res.clearCookie("__imsrt__", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(StatusCodes.OK).json({
      message: "Provided token pair invalidated.",
      details: { user },
    });
  } catch (error) {
    next(error);
  }
};
