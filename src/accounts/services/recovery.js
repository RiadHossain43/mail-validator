const { Manager } = require("./manager");
const bcrypt = require("bcryptjs");
const { Token } = require("../../common/helper");
const { sendMail } = require("../../email/sendMail");
const { APIError } = require("../../common/helper/error/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class Recovery extends Manager {
  constructor() {
    super();
  }
  async startAccountRecovery(email) {
    email = email?.toLowerCase();
    let user = await this.User.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User not found."
      );
    const accessTokenPayload = { _id: user._id };
    const recoveryToken = await Token.signToken(
      accessTokenPayload,
      process.env.JWT_KEY,
      {
        expiresIn: 600,
      }
    );
    if (!recoveryToken)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Recovery token could not be signed."
      );
    let recoveryLink = `${process.env.CLIENT_URL}/accounts/recovery-verification?recovery_token=${recoveryToken}`;
    await sendMail("account-recovery", email, {
      name: user.name,
      recoveryLink,
    });
    await this.User.updateOne(
      { email },
      {
        $set: {
          recoveryToken: recoveryToken,
        },
      }
    );
    return { email };
  }
  async recoverAccount(token, newPassword) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Recovery token is required"
      );
    let validationResponse = await Token.verify(token, process.env.JWT_KEY);
    if (!validationResponse.valid) {
      if (validationResponse.expired) {
        await this.User.updateOne(
          { email },
          {
            $set: {
              recoveryToken: null,
            },
          }
        );
        throw new APIError(
          ReasonPhrases.FORBIDDEN,
          StatusCodes.FORBIDDEN,
          "Token expired."
        );
      }
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Token is invalid."
      );
    }
    let { _id } = validationResponse.decoded;
    let user = await this.User.findOne({ _id });
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User not found."
      );
    if (user.recoveryToken !== token)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Token is too old."
      );
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(newPassword, salt);
    user = await this.User.findOneAndUpdate(
      { _id },
      {
        $set: {
          password: hashPassword,
          recoveryToken: null,
        },
      },
      { new: true }
    );
    return user;
  }
}
module.exports = { Recovery };
