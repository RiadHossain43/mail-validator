const { logger } = require("../../../common/helper");
const { push: pushValidationResult } = require("../socket/validation.emitter");
const { validate } = require("@riadhossain43/email-validator");
exports.consume = async (job) => {
  const records = job.data.records || [];
  logger.info(
    records.length + " email record(s) recieved for validation in the queue"
  );
  for (let record of records) {
    logger.info("attemting to validate " + record);
    try {
      let result = await validate(record);
      logger.debug("validation result for -> " + record, result);
      pushValidationResult({
        result,
        user: job.data.user,
      });
    } catch (err) {
      logger.error("error occured in validation queue", err);
    }
  }
};
exports.completeAction = async (job) => {};
