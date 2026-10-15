
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Student from "./Student.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Test server
app.get("/", (req, res) => {
  res.send("Student Management API is running!");
});

// Save student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    const student = await Student.create({
      name,
      email,
      age
    });

    res.json({
      message: "Student saved successfully!",
      student
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save student"
    });
  }
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get students"
    });
  }
});

// Delete student
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student deleted successfully!"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete student"
    });
  }
});

// Connect MongoDB
const PORT = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected successfully!");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} catch (error) {
  console.log("MongoDB connection failed:", error.message);
}
