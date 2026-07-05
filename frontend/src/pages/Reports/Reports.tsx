import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

interface Report {
  id?: number;
  title?: string;
  name?: string;
  priority?: string;
  status?: string;
  start_date?: string;
  due_date?: string;

  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
}

const Reports = () => {
  const [type, setType] = useState("completed");
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports();
  }, [type]);

  const fetchReports = async () => {
    try {
      const res = await API.get(`/reports?type=${type}`);
      setReports(res.data.reports);
    } catch (error) {
      console.log(error);
      alert("Failed to load reports");
    }
  };  return (
    <>
      <Navbar />

      <div
  style={{
    padding: "35px",
    background: "#f4f6f9",
    minHeight: "100vh",
  }}
>
        <h1
  style={{
    color: "#1976d2",
    marginBottom: "25px",
  }}
>
  Reports Dashboard
</h1>

        <select
  value={type}
  onChange={(e) => setType(e.target.value)}
  style={{
    padding: "10px",
    width: "250px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "25px",
  }}
>
  <option value="completed">Completed Tasks</option>
  <option value="pending">Pending Tasks</option>
  <option value="employee">Employee-wise Report</option>
</select>

        <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  }}
>
         <thead
  style={{
    background: "#1976d2",
    color: "white",
  }}
>
            {type === "employee" ? (
              <tr>
                <th>Employee</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Pending</th>
              </tr>
            ) : (
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Employee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
              </tr>
            )}
          </thead>

          <tbody>
  {reports.map((report, index) =>
    type === "employee" ? (
      <tr
        key={index}
        style={{
          background: index % 2 === 0 ? "#fff" : "#f8f9fa",
          textAlign: "center",
        }}
      >
        <td style={cellStyle}>{report.name}</td>
        <td style={cellStyle}>{report.totalTasks}</td>
        <td style={cellStyle}>{report.completedTasks}</td>
        <td style={cellStyle}>{report.pendingTasks}</td>
      </tr>
    ) : (
      <tr
        key={report.id}
        style={{
          background: index % 2 === 0 ? "#fff" : "#f8f9fa",
          textAlign: "center",
        }}
      >
        <td style={cellStyle}>{report.id}</td>

        <td style={cellStyle}>{report.title}</td>

        <td style={cellStyle}>{report.name}</td>

        <td style={cellStyle}>
          <span
            style={{
              background:
                report.priority === "High"
                  ? "#e53935"
                  : report.priority === "Medium"
                  ? "#fb8c00"
                  : "#43a047",
              color: "white",
              padding: "5px 12px",
              borderRadius: "15px",
            }}
          >
            {report.priority}
          </span>
        </td>

        <td style={cellStyle}>
          <span
            style={{
              background:
                report.status === "Completed"
                  ? "#43a047"
                  : report.status === "Pending"
                  ? "#e53935"
                  : "#fb8c00",
              color: "white",
              padding: "5px 12px",
              borderRadius: "15px",
            }}
          >
            {report.status}
          </span>
        </td>

        <td style={cellStyle}>
          {report.start_date?.substring(0, 10)}
        </td>

        <td style={cellStyle}>
          {report.due_date?.substring(0, 10)}
        </td>
      </tr>
    )
  )}
</tbody>
        </table>
      </div>
    </>
  );
};
const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid #ddd",
};
export default Reports;