const express = require("express");
const router = express.Router();

// Middleware
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

// Upload middleware
const upload = require("../config/upload");

// Controller
const {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// ===============================
// ADMIN ROUTES
// ===============================

// Create Task (with file upload)
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("file"),
  createTask
);

// Get all tasks (admin)
router.get("/", verifyToken, isAdmin, getAllTasks);

// Update task
router.put("/:id", verifyToken, isAdmin, upload.single("file"), updateTask);

// Delete task
router.delete("/:id", verifyToken, isAdmin, deleteTask);


// ===============================
// EMPLOYEE ROUTES
// ===============================

// Employee - My tasks
router.get("/mytasks", verifyToken, getMyTasks);

// Employee - Update Task Status
router.put(
  "/status/:id",
  verifyToken,
  updateTaskStatus
);

module.exports = router;