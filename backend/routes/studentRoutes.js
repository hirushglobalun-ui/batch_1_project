const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const authMiddleware = require("../middleware/authMiddleware");

// Apply authMiddleware to all routes for student isolation
router.use(authMiddleware);

// Create student (isolated by teacher)
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, studentClass } = req.body;
    const userId = req.user.id; // From authMiddleware

    // Generate studentId: std001, std002 etc.
    const latestStudent = await Student.findOne({}, {}, { sort: { 'studentId' : -1 } });
    let nextNum = 1;
    if (latestStudent && latestStudent.studentId) {
      const match = latestStudent.studentId.match(/std(\d+)/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    const studentId = `std${nextNum.toString().padStart(3, '0')}`;

    const student = await Student.create({
      name,
      age,
      gender,
      studentClass,
      studentId,
      userId // Save teacher's identity
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Read students (isolated by teacher)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const students = await Student.find({ userId }).sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update student (check ownership)
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found or unauthorized access" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete student (check ownership)
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!student) return res.status(404).json({ message: "Student not found or unauthorized access" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
