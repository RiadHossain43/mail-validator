const { Manager } = require("./manager");
const bcrypt = require("bcryptjs");
const { Token, logger } = require("../../common/helper");
const { APIError } = require("../../common/helper/error/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class Auth extends Manager {
  constructor() {
    super();
  }
  async authenticateIdentity({ availableToken, email, password, userAgent }) {
    email = email?.toLowerCase();
    if (!email || !password)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Email & Password are required."
      );
    const user = await this.User.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User not registered with this email."
      );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid credentials."
      );
    await this.Session.create({ userRef: user._id, userAgent });
    const newTokenPair = await this.getTokenPair(
      {
        user: {
          _id: user._id,
          name: user.name,
        },
      },
      {
        user: {
          _id: user._id,
          name: user.name,
        },
      }
    );

    /**
     * PROBLEM: security case needs to be handled.
     * what if:
     * 1. user logins in
     * 2. never uses refresh token & never logs out
     * 3. refresh token is stolen.
     * RESOLUTION : reuse detection required somehow on login process.
     */
    const newRefreshTokens = !availableToken
      ? [...user.refreshTokens]
      : user.refreshTokens?.filter((rt) => rt !== availableToken);
    user.refreshTokens = [...newRefreshTokens, newTokenPair.refreshToken];
    await user.save();
    return { ...newTokenPair, user: { _id: user._id, name: user.name } };
  }
  async getTokenPair(accessTokenPayload, refreshTokenPayload) {
    const accessToken = await Token.signToken(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );
    const refreshToken = await Token.signToken(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );
    return { accessToken, refreshToken };
  }
  async handleRefreshToken(refreshToken) {
    /**
     * PROBLEM: what if user is deleted and tokens are still valid.
     */
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.User.findOne({ refreshTokens: refreshToken });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundUser) {
      const validationResponse = await Token.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      if (!validationResponse.valid)
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "Invalid refresh token"
        );
      logger.info(
        "Refresh token reuse atempt detected, protecting hacked user..."
      );
      const hackedUser = await this.User.findOne({
        _id: validationResponse.decoded.user._id,
      });
      hackedUser.refreshTokens = [];
      const result = await hackedUser.save();
      logger.info("Printing user information...", { result });
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Reuse of refresh token."
      );
    }

    /**
     * Evaluation of refresh token to execute a token pair iteration.
     */
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    const validationResponse = await Token.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!validationResponse.valid) {
      foundUser.refreshTokens = [...newRefreshTokenArray];
      const result = await foundUser.save();
      logger.info("Refresh token expired, login required.", result);
    }
    if (
      !validationResponse.valid ||
      foundUser._id?.toString() !==
        validationResponse.decoded.user._id?.toString()
    )
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "User id don't match with refresh token."
      );

    /**
     * Refresh token passed all checks and is still valid.
     */
    const newTokenPair = await this.getTokenPair(
      {
        user: {
          _id: foundUser._id,
          name: foundUser.name,
        },
      },
      {
        user: {
          _id: foundUser._id,
          name: foundUser.name,
        },
      }
    );
    /**
     * Adding new refresh token for this current users refresh token family
     */
    foundUser.refreshTokens = [
      ...newRefreshTokenArray,
      newTokenPair.refreshToken,
    ];
    await foundUser.save();
    return { ...newTokenPair };
  }
  async invalidateRefreshToken(refreshToken) {
    if (!refreshToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No refresh token found."
      );
    const foundUser = await this.User.findOne({ refreshTokens: refreshToken });
    /**
     * Detected refresh token reuse.
     * Handling security on reuse of a token.
     */
    if (!foundUser)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    const newRefreshTokenArray = foundUser.refreshTokens.filter(
      (rt) => rt !== refreshToken
    );
    foundUser.refreshTokens = [...newRefreshTokenArray];
    return foundUser.save();
  }
}
module.exports = { Auth };
