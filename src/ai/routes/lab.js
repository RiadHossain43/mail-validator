const router = require("express").Router();
const {
  generateConversationResponse,
  generateNormalResponse,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const { labGuard } = require("../middlewares/labGuard");
const validateBody = validate("body");

router.use(labGuard);

router.post(
  "/gpt-stream",
  [validateBody(validaions.conversation.query)],
  generateConversationResponse
);
router.post(
  "/gpt-normal",
  [validateBody(validaions.conversation.query)],
  generateNormalResponse
);

module.exports = router;
