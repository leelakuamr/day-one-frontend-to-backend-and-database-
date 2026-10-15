
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("Saving...");

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
        throw new Error(data.message || "Failed to save student");
      }

      setMessage("Student saved successfully!");

      setForm({
        name: "",
        email: "",
        age: ""
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="container">
      <div className="form-card">
        <h1>Student Form</h1>
        <p>Enter your student details</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Enter Age"
            min="1"
            step="1"
            value={form.age}
            onChange={handleChange}
            required
          />

          <button type="submit">Save Student</button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;
