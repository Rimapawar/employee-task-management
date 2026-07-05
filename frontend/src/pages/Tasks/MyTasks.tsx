import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  start_date: string;
  due_date: string;
  attachment?: string;
  name?: string;
}

const MyTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await API.get("/tasks/mytasks");
      setTasks(res.data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      await API.put(`/tasks/status/${id}`, {
        status,
      });

      alert("Task Status Updated Successfully");

      fetchMyTasks();
    } catch (error: any) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to update status"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div
  style={{
    padding: "35px",
    background: "#f4f6f9",
    minHeight: "100vh",
  }}
>
        <h1>My Tasks</h1>

        <table
          border={1}
          cellPadding={10}
          width="100%"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Attachment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
           {tasks.map((t) => (
  <tr key={t.id}>
    <td>{t.id}</td>

    <td>{t.title}</td>

    <td>{t.status}</td>

    <td>{t.priority}</td>

    <td>
      {t.attachment ? (
        <a
          href={`http://localhost:5000/uploads/${t.attachment}`}
          target="_blank"
          rel="noreferrer"
        >
          View File
        </a>
      ) : (
        "No File"
      )}
    </td>

    <td>
      {t.status === "Pending" && (
        <button
          onClick={() =>
            updateStatus(t.id, "In Progress")
          }
        >
          Start Progress
        </button>
      )}

      {t.status === "In Progress" && (
        <button
          onClick={() =>
            updateStatus(t.id, "Completed")
          }
        >
          Mark Completed
        </button>
      )}

      {t.status === "Completed" && (
        <span
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          ✔ Completed
        </span>
      )}
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyTasks;