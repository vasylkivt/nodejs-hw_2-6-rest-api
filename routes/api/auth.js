const express = require("express");
const router = express.Router();

const auth = require("../../controllers/auth");
const { validateBody, authenticate, upload } = require("../../middlewares");
const scheme = require("../../utils/validation/userValidationSchemas");

router.post("/register", validateBody(scheme.register), auth.register);

router.get("/verify/:verificationToken", auth.verifyEmail);

router.post(
  "/verify",
  validateBody(scheme.emailSchema),
  auth.resendVerifyEmail
);

router.post("/login", validateBody(scheme.login), auth.login);

router.patch(
  "/subscription",
  authenticate,
  validateBody(scheme.subscription),
  auth.subscription
);

router.get("/current", authenticate, auth.current);
router.post("/logout", authenticate, auth.logout);

router.patch("/avatar", authenticate, upload.single("avatar"), auth.avatar);

module.exports = router;
