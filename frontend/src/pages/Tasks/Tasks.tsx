import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

interface Task {
  id?: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  start_date: string;
  due_date: string;
  employee_id: number;
  name?: string;
  attachment?: string;
  file?: File | null;
}

interface Employee {
  id: number;
  name: string;
}

const Tasks = () => {
  const user = JSON.parse(
    localStorage.getItem("user") ||
      sessionStorage.getItem("user") ||
      "{}"
  );

  const isAdmin = user.role === "admin";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [formData, setFormData] = useState<Task>({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    start_date: "",
    due_date: "",
    employee_id: 1,
    file: null,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);

  const limit = 5;

  useEffect(() => {
    if (isAdmin) {
      fetchEmployees();
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [search, sort, order, page]);

  const fetchTasks = async () => {
    try {
      let res;

      if (isAdmin) {
        res = await API.get(
          `/tasks?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`
        );
      } else {
        res = await API.get("/tasks/mytasks");
      }

      setTasks(res.data.tasks);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data.employees);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "employee_id"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("priority", formData.priority);
      data.append("status", formData.status);
      data.append("start_date", formData.start_date);
      data.append("due_date", formData.due_date);
      data.append(
        "employee_id",
        String(formData.employee_id)
      );

      if (formData.file) {
        data.append("file", formData.file);
      }

      if (editingId) {
        await API.put(`/tasks/${editingId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await API.post("/tasks", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert(
        editingId
          ? "Task Updated Successfully"
          : "Task Added Successfully"
      );

      setFormData({
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        start_date: "",
        due_date: "",
        employee_id:
          employees.length > 0
            ? employees[0].id
            : 1,
        file: null,
      });

      setEditingId(null);

      fetchTasks();
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || error.message);
    }
  };
    const handleEdit = (task: Task) => {
    setEditingId(task.id!);

    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      start_date: task.start_date?.substring(0, 10),
      due_date: task.due_date?.substring(0, 10),
      employee_id: task.employee_id,
      file: null,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm("Delete this task?")) return;

      await API.delete(`/tasks/${id}`);
      alert("Task Deleted Successfully");
      fetchTasks();
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.message || error.message);
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
        <h1
  style={{
    color: "#1976d2",
    marginBottom: "25px",
  }}
>
  Task Management
</h1>

        {/* SEARCH + FILTERS */}
        <input
  placeholder="Search tasks..."
  value={search}
  onChange={(e) => {
    setSearch(e.target.value);
    setPage(1);
  }}
  style={{
    width: "300px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginRight: "15px",
    marginBottom: "20px",
  }}
/>

        <select
  onChange={(e) => setSort(e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "8px",
    marginRight: "10px",
    border: "1px solid #ccc",
  }}
>
          <option value="created_at">Newest</option>
          <option value="title">Title</option>
          <option value="status">Status</option>
        </select>

        <select
  onChange={(e) => setOrder(e.target.value)}
  style={{
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
>
          <option value="desc">DESC</option>
          <option value="asc">ASC</option>
        </select>

        <div style={{ height: "20px" }} />

        {/* TASK FORM */}
        
        <div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,.1)",
    marginBottom: "30px",
  }}
>
<form onSubmit={handleSubmit}>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    }}
  >
    <div>
      <label><b>Task Title</b></label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        required
        style={inputStyle}
      />
    </div>

    <div>
      <label><b>Assign Employee</b></label>
      <select
        name="employee_id"
        value={formData.employee_id}
        onChange={handleChange}
        style={inputStyle}
      >
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.name}
          </option>
        ))}
      </select>
    </div>

    <div style={{ gridColumn: "1 / span 2" }}>
      <label><b>Description</b></label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Task Description"
        rows={4}
        style={inputStyle}
      />
    </div>

    <div>
      <label><b>Priority</b></label>
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        style={inputStyle}
      >
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>
    </div>

    <div>
      <label><b>Status</b></label>
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        style={inputStyle}
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
    </div>

    <div>
      <label><b>Start Date</b></label>
      <input
        type="date"
        name="start_date"
        value={formData.start_date}
        onChange={handleChange}
        style={inputStyle}
      />
    </div>

    <div>
      <label><b>Due Date</b></label>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
        style={inputStyle}
      />
    </div>

    <div style={{ gridColumn: "1 / span 2" }}>
      <label><b>Attachment</b></label>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginTop: "10px" }}
      />
    </div>
  </div>

  <button
    type="submit"
    style={{
      marginTop: "25px",
      background: "#1976d2",
      color: "white",
      border: "none",
      padding: "12px 30px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
    }}
  >
    {editingId ? "Update Task" : "Add Task"}
  </button>
</form>

        </div>

        <hr />

        {/* TASK TABLE */}
        <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,.1)",
  }}
>
         <thead
  style={{
    background: "#1976d2",
    color: "white",
  }}
>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Attachment</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.name}</td>
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
                  <button
  onClick={() => handleEdit(t)}
  style={{
    background: "#fb8c00",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    marginRight: "8px",
    cursor: "pointer",
  }}
  
>Edit </button>

                  <button
  onClick={() => handleDelete(t.id!)}
  style={{
    background: "#e53935",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div
  style={{
    marginTop: "25px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
  }}
>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span style={{ margin: "0 10px" }}>Page {page}</span>

          <button onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box" as const,
};
export default Tasks;