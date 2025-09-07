const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { register, login, getMe, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Valid email required").isEmail(),
  check("password", "Password min 6 chars").isLength({ min: 6 })
], register);

router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
module.exports = router;
