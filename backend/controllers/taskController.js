const db = require("../config/db");

// ===============================
// CREATE TASK (with file upload)
// ===============================
const createTask = (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    start_date,
    due_date,
    employee_id,
  } = req.body;

  const attachment = req.file ? req.file.filename : null;

  if (new Date(due_date) < new Date(start_date)) {
    return res.status(400).json({
      success: false,
      message: "Due Date cannot be earlier than Start Date",
    });
  }

  db.query(
    `INSERT INTO tasks 
    (title, description, priority, status, start_date, due_date, employee_id, attachment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description,
      priority,
      status,
      start_date,
      due_date,
      employee_id,
      attachment,
    ],
    (err) => {
      if (err) {
  console.log("DATABASE ERROR:");
  console.log(err);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}

      res.status(201).json({
        success: true,
        message: "Task Created Successfully",
      });
    }
  );
};

// ===============================
// GET ALL TASKS (SEARCH + SORT + PAGINATION)
// ===============================
const getAllTasks = (req, res) => {
  let {
    search = "",
    sort = "created_at",
    order = "DESC",
    page = 1,
    limit = 5,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  // ✅ SAFE SORTING (IMPORTANT FIX)
  const allowedSort = ["created_at", "title", "status"];
  const allowedOrder = ["ASC", "DESC"];

  if (!allowedSort.includes(sort)) sort = "created_at";
  if (!allowedOrder.includes(order)) order = "DESC";

  const sql = `
    SELECT tasks.*, employees.name
    FROM tasks
    JOIN employees ON tasks.employee_id = employees.id
    WHERE tasks.title LIKE ? OR employees.name LIKE ?
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;

  // Step 1: get total count for pagination
  db.query(
    `SELECT COUNT(*) as total FROM tasks`,
    (err, countResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      const total = countResult[0].total;

      // Step 2: fetch paginated data
      db.query(
        sql,
        [`%${search}%`, `%${search}%`, limit, offset],
        (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            tasks: result,
            total,
            page,
            totalPages: Math.ceil(total / limit),
          });
        }
      );
    }
  );
};

// ===============================
// GET MY TASKS (EMPLOYEE)
// ===============================
const getMyTasks = (req, res) => {
  const email = req.user.email;

  db.query(
    `
    SELECT tasks.*, employees.name
    FROM tasks
    JOIN employees ON tasks.employee_id = employees.id
    JOIN users ON users.email = employees.email
    WHERE users.email = ?
    `,
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        tasks: result,
      });
    }
  );
};
// ===============================
// EMPLOYEE UPDATE TASK STATUS
// ===============================
const updateTaskStatus = (req, res) => {
  const { status } = req.body;

  // Employee can only use these statuses
  if (!["Pending", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Status",
    });
  }

  const email = req.user.email;

  db.query(
    `
    SELECT tasks.id
    FROM tasks
    JOIN employees ON tasks.employee_id = employees.id
    JOIN users ON users.email = employees.email
    WHERE tasks.id=? AND users.email=?
    `,
    [req.params.id, email],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(403).json({
          success: false,
          message: "You are not allowed to update this task",
        });
      }

      db.query(
        "UPDATE tasks SET status=? WHERE id=?",
        [status, req.params.id],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            message: "Task Status Updated Successfully",
          });
        }
      );
    }
  );
};
// ===============================
// UPDATE TASK (FIXED + SAFE)
// ===============================
const updateTask = (req, res) => {
  const {
    title,
    description,
    priority,
    status,
    start_date,
    due_date,
    employee_id,
  } = req.body;

  const attachment = req.file ? req.file.filename : null;

  db.query(
    "SELECT * FROM tasks WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Task not found",
        });
      }

      if (result[0].status === "Completed") {
        return res.status(400).json({
          success: false,
          message: "Completed tasks cannot be edited",
        });
      }

      db.query(
        `UPDATE tasks SET
        title=?,
        description=?,
        priority=?,
        status=?,
        start_date=?,
        due_date=?,
        employee_id=?,
        attachment=COALESCE(?, attachment)
        WHERE id=?`,
        [
          title,
          description,
          priority,
          status,
          start_date,
          due_date,
          employee_id,
          attachment,
          req.params.id,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            message: "Task Updated Successfully",
          });
        }
      );
    }
  );
};

// ===============================
// DELETE TASK
// ===============================
const deleteTask = (req, res) => {
  db.query("DELETE FROM tasks WHERE id=?", [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      message: "Task Deleted Successfully",
    });
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
};