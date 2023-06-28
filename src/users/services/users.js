const { APIError } = require("../../common/helper/error/apiError");
const { Manager } = require("./manager");
const { subscriptionStatuses } = require("../../models/user");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { s3Client } = require("../../.config/awsS3");
const bcrypt = require("bcryptjs");
const { FileManager } = require("../../common/helper/fileManager");
class User extends Manager {
  constructor() {
    super();
  }
  async listUsers(query, options) {
    let pagination = await this.User.paginate(query, options);
    return pagination;
  }
  async getUser(query) {
    let exist = await this.User.findOne(query);
    if (!exist)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "User not found with given query."
      );
    return exist;
  }
  async updateProfileInformation(id, data) {
    let user = await this.getUser({ _id: id });
    user.name = data.name;
    user.organisationName = data.organisationName;
    user.jobTitle = data.jobTitle;
    return user.save();
  }
  async updateActivityStatus(id, data) {
    let user = await this.getUser({ _id: id });
    user.activity.status = data.status;
    user.activity.lastSeen = Date.now();
    return user.save();
  }
  async changePassword(id, data) {
    const { password, oldPassword } = data;
    if (oldPassword === password)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Current password can not be used."
      );
    let user = await this.getUser({ _id: id });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Invalid credentials."
      );

    const salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    user = await this.User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          password: hashPassword,
        },
      },
      { new: true }
    );
    return user;
  }
  async updateProfileImage(id, data) {
    let user = await this.getUser({ _id: id });
    if (JSON.stringify(user.profileImage.metaInfo) === JSON.stringify(data))
      throw new APIError(
        ReasonPhrases.BAD_REQUEST,
        StatusCodes.BAD_REQUEST,
        "Update with save image information is not allowed."
      );
    let fileManager = new FileManager();
    /** this means already there was profile picture */
    if (user.profileImage.metaInfo?.Bucket)
      await fileManager.deleteFile(user.profileImage.metaInfo);
    user = await this.User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          profileImage: {
            src: process.env.ASSETS_BASE_URL + "/" + data.Key,
            metaInfo: data,
          },
        },
      },
      { new: true }
    );
    return user;
  }
  async scheduleDeactivation(id, data) {
    await this.getUser({ _id: id });
    return this.User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          subscriptionInformation: {
            status: subscriptionStatuses.UNSUBSCRIBED,
            endsAfter: data.date,
          },
          paymentInformation: {
            paymentMethodId: null,
            suscriptionId: null,
            customerId: null,
          },
        },
      },
      { new: true }
    );
  }
  async hardRemoveUser(id) {
    const user = await this.getUser({ _id: id });
    if (user) {
      return this.User.deleteOne({ _id: id });
    }
  }
  async hardRemoveUsers(query) {
    return this.User.deleteMany(query);
  }
}
module.exports = { User };
