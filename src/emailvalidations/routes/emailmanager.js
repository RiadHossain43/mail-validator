const router = require("express").Router();
const {
  createEmailValidations,
  listEmailValidations,
  editEmailValidation,
  getEmailValidation,
  softRemoveEmailValidation,
  hardRemoveEmailValidation,
  restoreEmailValidation,
  startValidation,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post(
  "/",
  [validateBody(validaions.createEmailValidationRecords)],
  createEmailValidations
);

router.get("/", [], listEmailValidations);

router.put(
  "/:id",
  [validateBody(validaions.editEmailValidationRecord)],
  editEmailValidation
);

router.get("/:id", [], getEmailValidation);

router.post(
  "/soft-deletion",
  [validateBody(validaions.bulkActionEmailValidationRecords)],
  softRemoveEmailValidation
);

router.post(
  "/hard-deletion",
  [validateBody(validaions.bulkActionEmailValidationRecords)],
  hardRemoveEmailValidation
);

router.post(
  "/restoration",
  [validateBody(validaions.bulkActionEmailValidationRecords)],
  restoreEmailValidation
);

router.post(
  "/validation",
  [validateBody(validaions.validationSet)],
  startValidation
);

module.exports = router;
