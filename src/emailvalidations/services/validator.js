const { EmailValidationsCRUD } = require("./emailmanager");
// const validationqueue = require("./queues/validation.queue");
class Validator extends EmailValidationsCRUD {
  constructor() {
    super();
  }
  async startValidation(data) {
    // validationqueue.produce(data);
    return "Dataset sent to queue.";
  }
}
module.exports = { Validator };
