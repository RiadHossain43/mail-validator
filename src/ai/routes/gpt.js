const router = require("express").Router();
const {
  generateConversationResponse,
  generateNormalResponse,
  generateImageResponse,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post(
  "/gpt-stream",
  [validateBody(validaions.conversation.textquery)],
  generateConversationResponse
);
router.post(
  "/gpt-normal",
  [validateBody(validaions.conversation.textquery)],
  generateNormalResponse
);
router.post(
  "/gpt-image",
  [validateBody(validaions.conversation.imagequery)],
  generateImageResponse
);

module.exports = router;
