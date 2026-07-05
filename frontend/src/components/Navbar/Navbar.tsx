import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const Navbar = () => {
  const navigate = useNavigate();
  const role = useSelector((state: RootState) => state.auth.role);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    }
  };

  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
    padding: "8px 14px",
    borderRadius: "6px",
  };

  return (
    <nav
      style={{
        background: "#1565c0",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: "#fff",
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "0.5px",
        }}
      >
        Employee Task Management
      </div>

      {/* Right Side */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Link to="/dashboard" style={linkStyle}>
          Dashboard
        </Link>

        {role === "admin" && (
          <>
            <Link to="/employees" style={linkStyle}>
              Employees
            </Link>

            <Link to="/tasks" style={linkStyle}>
              Tasks
            </Link>

            <Link to="/reports" style={linkStyle}>
              Reports
            </Link>
          </>
        )}

        {role === "employee" && (
          <Link to="/my-tasks" style={linkStyle}>
            My Tasks
          </Link>
        )}

        <button
          onClick={logout}
          style={{
            backgroundColor: "#e53935",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;