const { Manager } = require("./manager");
const bcrypt = require("bcryptjs");
const { Token } = require("../../common/helper");
const { sendMail } = require("../../email/sendMail");
const { APIError } = require("../../common/helper/error/apiError");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

class Registration extends Manager {
  constructor() {
    super();
  }
  async startRegistration(data) {
    if (!data)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Data is required."
      );
    let { name, email, password } = data;
    email = email.toLowerCase();
    let user = await this.User.findOne({ email });
    if (user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "An account is already registerd with this email."
      );
    let accessTokenPayload = {
      name,
      email,
    };
    const registrationToken = await Token.signToken(
      accessTokenPayload,
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!registrationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Registration token could not be signed."
      );
    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    let newUser = new this.User({
      name,
      email,
      password: hashPassword,
      emailVerification: { token: registrationToken },
    });
    await newUser.save();
    let verificationLink = `${process.env.CLIENT_URL}/accounts/registration-verification/?registration_token=${registrationToken}`;
    await sendMail("account-verification", email, { name, verificationLink });
    return { user: { _id: newUser._id, name: newUser.name } };
  }
  async verifyRegistration(token) {
    if (!token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Registration token is required"
      );
    let validationResponse = await Token.verify(token, process.env.JWT_KEY);
    if (!validationResponse.valid) {
      if (validationResponse.expired) {
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
    let { name, email, password } = validationResponse.decoded;
    let user = await this.User.findOne({ email });
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User not found."
      );
    if (user.emailVerification.token !== token)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Token is too old."
      );
    user = await this.User.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          email,
          emailVerification: {
            token: null,
            status: "Verified",
            verificationDate: Date.now(),
          },
        },
      },
      { new: true }
    );
    return user;
  }
  async resendVerification(id) {
    let user = await this.User.findOne({ _id: id });
    if (!user)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "No user found with this id."
      );
    if (user.emailVerification.status === "Verified")
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "User is already verified."
      );
    let accessTokenPayload = {
      name: user.name,
      email: user.email,
    };
    const registrationToken = await Token.signToken(
      accessTokenPayload,
      process.env.JWT_KEY,
      { expiresIn: 600 }
    );
    if (!registrationToken)
      throw new APIError(
        ReasonPhrases.FORBIDDEN,
        StatusCodes.FORBIDDEN,
        "Registration token could not be signed."
      );
    await this.User.updateOne(
      { _id: id },
      {
        $set: { emailVerification: { token: registrationToken } },
      }
    );
    let verificationLink = `${process.env.CLIENT_URL}/accounts/registration-verification/?registration_token=${registrationToken}`;
    await sendMail("account-verification", user.email, {
      name: user.name,
      verificationLink,
    });
    return { user: { _id: user._id, name: user.name } };
  }
}
module.exports = { Registration };
