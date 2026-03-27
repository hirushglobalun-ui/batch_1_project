const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  studentClass: { type: String, required: true, enum: ["Plus One", "Plus Two"] },
  studentId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // Teacher ownership
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
