const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { logger } = require("../common/helper");
exports.connectDataBase = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.plugin(mongoosePaginate);
    await mongoose.connect(process.env.MONGO_URI + process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });
    logger.info("Database connected");
  } catch (err) {
    logger.error(err.message);
    logger.error(err.stack);
    // Exit process with failure
    process.exit(1);
  }
};
