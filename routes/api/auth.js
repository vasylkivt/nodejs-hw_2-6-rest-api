const express = require("express");
const router = express.Router();

const auth = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { scheme } = require("../../models/user");

router.post("/register", validateBody(scheme.register), auth.register);

router.post("/login", validateBody(scheme.login), auth.login);

router.patch(
  "/subscription",
  authenticate,
  validateBody(scheme.subscription),
  auth.subscription
);

router.get("/current", authenticate, auth.current);
router.post("/logout", authenticate, auth.logout);

module.exports = router;
