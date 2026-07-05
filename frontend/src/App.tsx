import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Employees from "./pages/Employees/Employees";
import Tasks from "./pages/Tasks/Tasks";
import MyTasks from "./pages/Tasks/MyTasks";
import RoleRoute from "./components/ProtectedRoute/RoleRoute";
import Reports from "./pages/Reports/Reports";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard (Admin + Employee) */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute allowedRoles={["admin", "employee"]}>
            <Dashboard />
          </RoleRoute>
        }
      />

      {/* Employees (ONLY ADMIN) */}
      <Route
        path="/employees"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <Employees />
          </RoleRoute>
        }
      />

      {/* ADMIN TASK PAGE (CRUD) */}
      <Route
        path="/tasks"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <Tasks />
          </RoleRoute>
        }
      />

      {/* EMPLOYEE TASK PAGE (READ ONLY) */}
      <Route
        path="/my-tasks"
        element={
          <RoleRoute allowedRoles={["employee"]}>
            <MyTasks />
          </RoleRoute>
        }
      />

      <Route
  path="/reports"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <Reports />
    </RoleRoute>
  }
/>
    </Routes>
  );
}

export default App;