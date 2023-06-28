const express = require("express");
const router = express.Router();
router.use("/", require("./gpt"));
module.exports = router;
