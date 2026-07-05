const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Add Employee
const addEmployee = async (req, res) => {
  const { name, email, department, designation } = req.body;

  try {
    // Check if employee email already exists in employees table
    db.query(
      "SELECT * FROM employees WHERE email=?",
      [email],
      async (err, employeeResult) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        if (employeeResult.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Employee email already exists.",
          });
        }

        // Check if login account already exists
        db.query(
          "SELECT * FROM users WHERE email=?",
          [email],
          async (err, userResult) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: err.message,
              });
            }

            if (userResult.length > 0) {
              return res.status(400).json({
                success: false,
                message: "User account already exists.",
              });
            }

            // Insert employee
            db.query(
              "INSERT INTO employees(name,email,department,designation) VALUES(?,?,?,?)",
              [name, email, department, designation],
              async (err) => {
                if (err) {
                  return res.status(500).json({
                    success: false,
                    message: err.message,
                  });
                }

                // Create login account
                const defaultPassword = "employee123";
                const hashedPassword = await bcrypt.hash(defaultPassword, 10);

                db.query(
  "INSERT INTO users(full_name,email,password,role) VALUES(?,?,?,?)",
  [name, email, hashedPassword, "Employee"],
  (err) => {

    if (err) {
      console.log("USER INSERT ERROR:");
      console.log(err);

      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    console.log("USER CREATED SUCCESSFULLY");

    res.status(201).json({
      success: true,
      message: "Employee Added Successfully",
      loginEmail: email,
      defaultPassword: "employee123",
    });
  }
);
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Employees
const getEmployees = (req, res) => {
  let {
    search = "",
    sort = "name",
    order = "ASC",
    page = 1,
    limit = 5,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;

  const query = `
    SELECT * FROM employees
    WHERE name LIKE ? OR email LIKE ?
    ORDER BY ${sort} ${order}
    LIMIT ? OFFSET ?
  `;

  db.query(
    query,
    [`%${search}%`, `%${search}%`, limit, offset],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        page,
        limit,
        employees: result,
      });
    }
  );
};

// Get Employee By ID
const getEmployeeById = (req, res) => {
  db.query(
    "SELECT * FROM employees WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        employee: result[0],
      });
    }
  );
};

// Update Employee
const updateEmployee = (req, res) => {
  const { name, email, department, designation } = req.body;

  db.query(
    "UPDATE employees SET name=?,email=?,department=?,designation=? WHERE id=?",
    [name, email, department, designation, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee Updated Successfully",
      });
    }
  );
};

// Delete Employee
const deleteEmployee = (req, res) => {
  db.query(
    "DELETE FROM employees WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Employee Deleted Successfully",
      });
    }
  );
};

module.exports = {
  addEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};