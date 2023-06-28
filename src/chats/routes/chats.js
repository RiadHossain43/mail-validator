const router = require("express").Router();
const {
  createChat,
  editChat,
  listChats,
  getChat,
  softRemoveChat,
  hardRemoveChat,
  restoreChat,
  react,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post("/", [validateBody(validaions.createChat)], createChat);

router.get("/", [], listChats);

router.put("/:id", [validateBody(validaions.editChat)], editChat);

router.get("/:id", [], getChat);

router.delete("/:id/soft", [], softRemoveChat);

router.delete("/:id/hard", [], hardRemoveChat);

router.put("/:id/restore", [], restoreChat);

router.put("/:id/reactions", [validateBody(validaions.reactOnChat)], react);

module.exports = router;
