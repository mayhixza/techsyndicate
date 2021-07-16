const {
  requireAuth,
  checkUser,
  notRequireAuth,
} = require("../middleware/authMiddleware");
const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/signup", notRequireAuth, authController.signup_get);
router.post("/signup", notRequireAuth, authController.signup_post);
router.get("/login", notRequireAuth, authController.login_get);
router.post("/login", notRequireAuth, authController.login_post);
router.get("/logout", requireAuth, authController.logout_get);
router.get("/protected", requireAuth, authController.prot_test);

module.exports = router;
