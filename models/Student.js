const mongoose = require('mongoose');

// One document = one student. Courses are EMBEDDED as an array (NoSQL style, no JOIN needed).
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true, trim: true },
  fullName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  major:     { type: String, required: true, trim: true },
  year:      { type: Number, min: 1, max: 6, default: 1 },
  courses:   [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
