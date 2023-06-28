const express = require("express");
const router = express.Router();
router.use("/", require("./emailmanager"));
module.exports = router;
