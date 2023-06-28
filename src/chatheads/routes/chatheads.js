const router = require("express").Router();
const {
  editChathead,
  createChathead,
  listChatheads,
  getChathead,
  softRemoveChathead,
  hardRemoveChathead,
  restoreChathead,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post("/", [validateBody(validaions.createChathead)], createChathead);

router.get("/", [], listChatheads);

router.put("/:id", [validateBody(validaions.editChathead)], editChathead);

router.get("/:id", [], getChathead);

router.delete("/:id/soft", [], softRemoveChathead);

router.delete("/:id/hard", [], hardRemoveChathead);

router.put("/:id/restore", [], restoreChathead);

module.exports = router;
