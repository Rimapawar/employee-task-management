import { useEffect, useState } from "react";
import API from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";

interface Employee {
  id?: number;
  name: string;
  email: string;
  department: string;
  designation: string;
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [formData, setFormData] = useState<Employee>({
    name: "",
    email: "",
    department: "",
    designation: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchEmployees();
  }, [search, sort, order, page]);

  const fetchEmployees = async () => {
  try {
    const res = await API.get(
      `/employees?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`
    );

    setEmployees(res.data.employees);
  } catch (error) {
    console.log(error);
    alert("Failed to fetch employees");
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (editingId) {
      await API.put(`/employees/${editingId}`, formData);

      alert("Employee Updated Successfully");
    } else {
      const res = await API.post("/employees", formData);

      alert(
        `Employee Added Successfully!

Login Email: ${res.data.loginEmail}
Default Password: ${res.data.defaultPassword}`
      );
    }

    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
    });

    setEditingId(null);
    fetchEmployees();
  } catch (error: any) {
    console.log(error);

    alert(error.response?.data?.message || "Operation Failed");
  }
};
  
  const editEmployee = (emp: Employee) => {
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      designation: emp.designation,
    });

    setEditingId(emp.id!);
  };

  const cancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      department: "",
      designation: "",
    });
  };

  const deleteEmployee = async (id: number) => {
    if (!window.confirm("Delete this employee?")) return;

    try {
      await API.delete(`/employees/${id}`);
      alert("Employee Deleted Successfully");
      fetchEmployees();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
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
    Employee Management
  </h1>
        {/* Search Box */}
       <input
  type="text"
  placeholder="Search employee..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  style={{
    width: "320px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  }}
/>


<select
  value={sort}
  onChange={(e) => setSort(e.target.value)}
  style={{ padding: "8px", marginRight: "10px" }}
>
  <option value="created_at">Newest</option>
  <option value="name">Name</option>
  <option value="department">Department</option>
</select>


<select
  value={order}
  onChange={(e) => setOrder(e.target.value)}
  style={{ padding: "8px" }}
>
  <option value="asc">Ascending</option>
  <option value="desc">Descending</option>
</select>

<br />
<br />
        <div
  style={{
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  }}
>
<form onSubmit={handleSubmit}>
          <input
  type="text"
  name="name"
  placeholder="Employee Name"
  value={formData.name}
  onChange={handleChange}
  style={{
    width: "220px",
    padding: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

          <input
  type="email"
  name="email"
  placeholder="Email"
  value={formData.email}
  onChange={handleChange}
  style={{
    width: "220px",
    padding: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

          <input
  type="text"
  name="department"
  placeholder="Department"
  value={formData.department}
  onChange={handleChange}
  style={{
    width: "220px",
    padding: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

          <input
  type="text"
  name="designation"
  placeholder="Designation"
  value={formData.designation}
  onChange={handleChange}
  style={{
    width: "220px",
    padding: "10px",
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  }}
/>

          <button
  type="submit"
  style={{
    background: "#1976d2",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
            {editingId ? "Update Employee" : "Add Employee"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
  marginLeft: "10px",
  background: "#757575",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "6px",
  cursor: "pointer",
}}
            >
              Cancel
            </button>
          )}
        </form>
        </div>

        <br />

        <table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
    borderRadius: "10px",
    overflow: "hidden",
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
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Login Email</th>
<th>Default Password</th>
<th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td>{emp.email}</td>
                <td>employee123</td>
                <td></td>
                <td>
                  <button
                    onClick={() => editEmployee(emp)}
                    style={{
                      background: "orange",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteEmployee(emp.id!)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
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

        <div
  style={{
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  }}
>
  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
  >
    Previous
  </button>

  <span>Page {page}</span>

  <button
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</div>

      </div>
    </>
  );
};

export default Employees; 