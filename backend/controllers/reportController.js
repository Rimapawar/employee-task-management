const db = require("../config/db");

// =====================================
// GET REPORTS
// =====================================
const getReports = (req, res) => {
  const { type } = req.query;

  let query = "";

  switch (type) {
    case "completed":
      query = `
        SELECT
          tasks.id,
          tasks.title,
          employees.name,
          tasks.priority,
          tasks.status,
          tasks.start_date,
          tasks.due_date
        FROM tasks
        JOIN employees
          ON tasks.employee_id = employees.id
        WHERE tasks.status='Completed'
      `;
      break;

    case "pending":
      query = `
        SELECT
          tasks.id,
          tasks.title,
          employees.name,
          tasks.priority,
          tasks.status,
          tasks.start_date,
          tasks.due_date
        FROM tasks
        JOIN employees
          ON tasks.employee_id = employees.id
        WHERE tasks.status!='Completed'
      `;
      break;

    case "employee":
      query = `
        SELECT
          employees.name,
          COUNT(tasks.id) AS totalTasks,
          SUM(tasks.status='Completed') AS completedTasks,
          SUM(tasks.status='Pending') AS pendingTasks
        FROM employees
        LEFT JOIN tasks
          ON employees.id=tasks.employee_id
        GROUP BY employees.id
      `;
      break;

    default:
      return res.status(400).json({
        success: false,
        message: "Invalid Report Type",
      });
  }

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      reports: result,
    });
  });
};

module.exports = {
  getReports,
};