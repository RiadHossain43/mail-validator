const express = require("express");
const router = express.Router();
const { paymentWebhook } = require("../controllers");
const { logRequest } = require("../../common/middleware/logRequest");
// middlewares ...
router.use(express.raw({ type: "application/json" }));
router.use(logRequest);
router.post("/subscriptions/webhook", paymentWebhook);

module.exports = router;
