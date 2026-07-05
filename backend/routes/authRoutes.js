const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const { register, login } = require("../controllers/authController");

// ================= REGISTER =================
router.post(
  "/register",
  [
    body("full_name")
      .notEmpty()
      .withMessage("Full Name is required"),

    body("email")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain one uppercase letter")
      .matches(/[a-z]/)
      .withMessage("Password must contain one lowercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain one number"),

    body("role")
      .isIn(["Admin", "Employee"])
      .withMessage("Role must be Admin or Employee"),
  ],
  register
);

// ================= LOGIN =================
router.post("/login", login);

module.exports = router;