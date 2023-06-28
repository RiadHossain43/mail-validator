const router = require("express").Router();
const {
  subscribe,
  updateCardDetails,
  cancel,
  getPricingInformation,
  listPaymentHistory,
  manageSubscription,
  paymentWebhook,
} = require("../controllers");

// middlewares ...
const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post(
  "/subscriptions",
  [validateBody(validaions.subscription.create)],
  subscribe
);
router.post("/subscriptions/webhook", paymentWebhook);

router.get("/subscriptions/customer-portal", manageSubscription);

router.get("/subscriptions/history", listPaymentHistory);

router.get("/pricing-information", getPricingInformation);
router.put(
  "/subscriptions",
  [validateBody(validaions.subscription.update)],
  updateCardDetails
);

router.delete("/subscriptions", cancel);

module.exports = router;
