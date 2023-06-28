const { APIError } = require("../../common/helper/error/apiError");
const { Manager } = require("./manager");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class EmailValidationsCRUD extends Manager {
  constructor() {
    super();
  }
  async createEmailValidations(data) {
    const records = data.records.map((record) => ({
      email: record.email,
      score: record.score,
      validDomain: record.validDomain,
      validFormat: record.validFormat,
      validMailbox: record.validMailbox,
      validMXRecord: record.validMXRecord,
      isBlackListed: record.isBlackListed,
      isDisposable: record.isDisposable,
      isFree: record.isFree,
      createdBy: record.createdBy,
    }));
    return this.EmailValidations.insertMany(records);
  }
  async getEmailValidation(query) {
    const emailRecord = await this.EmailValidations.findOne(query);
    if (!emailRecord)
      throw new APIError(
        ReasonPhrases.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        "No emailRecord found with the given query."
      );
    return emailRecord;
  }
  async listEmailValidations(query, options) {
    let pagination = await this.EmailValidations.paginate(query, options);
    return pagination;
  }
  async editEmailValidation(id, data) {
    const emailRecord = await this.getEmailValidation({ _id: id });
    return emailRecord.save();
  }
  async softRemoveEmailValidation(ids) {
    return this.EmailValidations.softDelete({ _id: { $in: ids } });
  }
  async hardRemoveEmailValidation(ids) {
    return this.EmailValidations.deleteMany({ _id: { $in: ids } });
  }
  async restoreEmailValidation(ids) {
    return this.EmailValidations.restore({ _id: { $in: ids } });
  }
}
module.exports = { EmailValidationsCRUD };
