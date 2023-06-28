// // * * * * * *
// // | | | | | |
// // | | | | | day of week
// // | | | | month
// // | | | day of month
// // | | hour
// // | minute
// // second ( optional )
// query: { createdAt:{$lte:ISODate('2023-06-20T00:00:00.000+00:00')}, 'emailVerification.status':'Pending' }
const cron = require("node-cron");
const { User } = require("../users/services");
const { logger } = require("../common/helper");
async function run() {
  try {
    const userCrudOps = new User();
    const today = new Date();
    await userCrudOps.listUsers({ "emailVerification.status": "Verified" });
  } catch (err) {
    logger.error("unverified user handle cron error:", err?.stack);
  }
}
// send report every midnight....
exports.handleUnverifiedUsers = () => cron.schedule("0 0 * * *", run);
