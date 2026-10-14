
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Student from "./Student.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Test whether the server is running
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
}); 

// CREATE: Save a student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      !Number.isFinite(Number(age)) ||
      age === "" ||
      age === null ||
      age === undefined ||
      Number(age) < 1 ||
      !Number.isInteger(Number(age))
    ) {
      return res.status(400).json({
        message: "Enter a valid name, email and whole-number age."
      });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      age: Number(age)
    });

    res.status(201).json({
      message: "Student saved successfully!",
      student
    });
  } catch (error) {
    console.error("Save error:", error.message);

    res.status(500).json({
      message: "Could not save student."
    });
  }
});

// READ: Retrieve all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({
      createdAt: -1
    });

    res.json(students);
  } catch (error) {
    console.error("Read error:", error.message);

    res.status(500).json({
      message: "Could not retrieve students."
    });
  }
});

// DELETE: Delete one student by MongoDB ID
app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid student ID."
      });
    }

    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    res.json({
      message: "Student deleted successfully!"
    });
  } catch (error) {
    console.error("Delete error:", error.message);

    res.status(500).json({
      message: "Could not delete student."
    });
  }
});

// Connect to MongoDB, then start the server
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing from the .env file.");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected successfully!");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
} catch (error) {
  console.error("MongoDB connection failed:", error.message);
  process.exit(1);
}
