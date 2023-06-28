const router = require("express").Router();
const {
  changePassword,
  getUser,
  updateProfileInformation,
  updateProfileImage,
  updateActivityStatus,
} = require("../controllers");
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");

const validateBody = validate("body");
// middlewares ...

router.get("/:id", [], getUser);
router.put(
  "/:id",
  [validateBody(validaions.updateProfileData)],
  updateProfileInformation
);
router.put(
  "/:id/profile-image",
  [validateBody(validaions.updateProfileImage)],
  updateProfileImage
);
router.put(
  "/:id/activity-status",
  [validateBody(validaions.activityStatus)],
  updateActivityStatus
);
router.post("/:id/change-password", [], changePassword);

module.exports = router;
