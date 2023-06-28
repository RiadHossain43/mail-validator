const router = require("express").Router();
const { uploadUrl } = require("../controllers");

router.get("/upload-url", uploadUrl);

module.exports = router;
