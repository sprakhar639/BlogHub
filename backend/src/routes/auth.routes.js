const express = require("express");
const controller = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const { validationRegister, validationLogin } = require("../validation/auth.validation");
const router = express.Router();

router.post("/register", validationRegister, controller.registerUser);
router.post("/login", validationLogin, controller.loginUser);
router.post("/logout", controller.logOutUser);
router.get("/me", authMiddleware, controller.getCurrentUser);
module.exports = router;
