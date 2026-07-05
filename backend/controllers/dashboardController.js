const db = require("../config/db");

const getDashboard = (req, res) => {
  const dashboard = {};

  db.query(
    "SELECT COUNT(*) AS totalEmployees FROM employees",
    (err, empResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      dashboard.totalEmployees = empResult[0].totalEmployees;

      db.query(
        "SELECT COUNT(*) AS totalTasks FROM tasks",
        (err, taskResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          dashboard.totalTasks = taskResult[0].totalTasks;

          db.query(
            "SELECT COUNT(*) AS pendingTasks FROM tasks WHERE status='Pending'",
            (err, pendingResult) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });
              }

              dashboard.pendingTasks = pendingResult[0].pendingTasks;

              db.query(
                "SELECT COUNT(*) AS inProgressTasks FROM tasks WHERE status='In Progress'",
                (err, progressResult) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: err.message,
                    });
                  }

                  dashboard.inProgressTasks =
                    progressResult[0].inProgressTasks;

                  db.query(
                    "SELECT COUNT(*) AS completedTasks FROM tasks WHERE status='Completed'",
                    (err, completedResult) => {
                      if (err) {
                        return res.status(500).json({
                          success: false,
                          message: err.message,
                        });
                      }

                      dashboard.completedTasks =
                        completedResult[0].completedTasks;

                      res.status(200).json({
                        success: true,
                        data: dashboard,
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getDashboard,
};