
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: ""
  });

  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // READ: Get saved students
  async function fetchStudents() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to retrieve students.");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Load students when the page opens
  useEffect(() => {
    fetchStudents();
  }, []);

  // Update the form when a user types
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  // CREATE: Send form data to the backend
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save student.");
      }

      setMessage(data.message);

      setForm({
        name: "",
        email: "",
        age: ""
      });

      await fetchStudents();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // DELETE: Remove a student from MongoDB
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student.");
      }

      setMessage(data.message);
      await fetchStudents();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main className="container">
      <h1>Student Management App</h1>

      <p className="subtitle">
        Add students and manage records stored in MongoDB.
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Student Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter student name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="age">Age</label>
        <input
          id="age"
          name="age"
          type="number"
          min="1"
          step="1"
          placeholder="Enter age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Student"}
        </button>
      </form>

      {message && (
        <p className="message" role="status">
          {message}
        </p>
      )}

      <div className="list-heading">
        <h2>Saved Students</h2>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchStudents}
        >
          Refresh
        </button>
      </div>

      {students.length === 0 ? (
        <p className="empty">No students found. Add one above.</p>
      ) : (
        <div className="student-list">
          {students.map((student) => (
            <article className="student-card" key={student._id}>
              <div>
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <p>Age: {student.age}</p>
              </div>

              <button
                type="button"
                className="delete-button"
                onClick={() => handleDelete(student._id)}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
