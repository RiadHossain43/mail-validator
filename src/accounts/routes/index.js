const router = require("express").Router();
const {
  login,
  startRegistration,
  startAccountRecovery,
  verifyRegistration,
  recoverAccount,
  resendVerification,
  refreshToken,
  logout,
} = require("../controllers");

const { validate } = require("../../common/middleware/validator");
const validaions = require("../validations");
const validateBody = validate("body");

router.post("/auth/login", [validateBody(validaions.login)], login);

router.get("/auth/refresh-token", refreshToken);

router.post(
  "/registration",
  [validateBody(validaions.register)],
  startRegistration
);

router.post("/registration/verification", verifyRegistration);

router.post(
  "/registration/verification/emails",
  [validateBody(validaions.resedVerification)],
  resendVerification
);

router.post(
  "/recovery",
  [validateBody(validaions.requestRecovery)],
  startAccountRecovery
);

router.post(
  "/recovery/verification",
  [validateBody(validaions.verifyRecovery)],
  recoverAccount
);

router.delete("/auth/logout", logout);

module.exports = router;
