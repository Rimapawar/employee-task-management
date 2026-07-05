const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// All employee routes are protected and Admin only

router.post("/", verifyToken, isAdmin, addEmployee);

router.get("/", verifyToken, isAdmin, getEmployees);

router.get("/:id", verifyToken, isAdmin, getEmployeeById);

router.put("/:id", verifyToken, isAdmin, updateEmployee);

router.delete("/:id", verifyToken, isAdmin, deleteEmployee);

module.exports = router;