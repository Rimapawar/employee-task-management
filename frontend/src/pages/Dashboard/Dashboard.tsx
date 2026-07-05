import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

interface DashboardData {
  totalEmployees: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

const Dashboard = () => {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
  );

  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");

      const apiData = res.data.data;

      setData({
        totalEmployees: apiData.totalEmployees,
        totalTasks: apiData.totalTasks,
        pendingTasks: apiData.pendingTasks,
        inProgressTasks: apiData.inProgressTasks,
        completedTasks: apiData.completedTasks,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h1>
          Welcome, {user.full_name}
        </h1>

        <h2>
          {user.role === "admin"
            ? "Admin Dashboard"
            : "Employee Dashboard"}
        </h2>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
    gap: "20px",
  }}
>
  <div style={cardStyle}>
    <h3>Total Employees</h3>
    <h1>{data.totalEmployees}</h1>
  </div>

  <div style={cardStyle}>
    <h3>Total Tasks</h3>
    <h1>{data.totalTasks}</h1>
  </div>

  <div style={cardStyle}>
    <h3>Completed Tasks</h3>
    <h1>{data.completedTasks}</h1>
  </div>

  <div style={cardStyle}>
    <h3>Pending Tasks</h3>
    <h1>{data.pendingTasks}</h1>
  </div>
</div>
        
      </div>
    </>
  );
};

const cardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "25px",
  textAlign: "center" as const,
  boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
  border: "1px solid #e5e5e5",
};

export default Dashboard;