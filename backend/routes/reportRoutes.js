const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const { getReports } = require("../controllers/reportController");

// Admin only
router.get("/", verifyToken, isAdmin, getReports);

module.exports = router;