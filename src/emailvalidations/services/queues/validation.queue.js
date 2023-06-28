const Bull = require("bull");
const validationprocess = require("./validation.process");
const { logger } = require("../../../common/helper");
const queue = new Bull("email-validation", {
  redis: process.env.REDIS_URL
});
queue.process(validationprocess.consume);
exports.produce = (data) => {
  queue.add(data, {});
};
queue.on("completed", (job) => {
  validationprocess.completeAction(job);
  logger.info("cleaning up the completed campaign jobs.");
  queue.clean(0, "completed");
});
queue.on('error', (error) => {
  logger.error(error);
})
exports.cleanCompleted = (...args) => {
  queue.clean(...args);
};
