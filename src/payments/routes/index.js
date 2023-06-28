const express = require("express");
const router = express.Router();
router.use("/", require("./payments"));
module.exports = router;
