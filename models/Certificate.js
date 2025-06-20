const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  score: Number,
  awardedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Certificate", certificateSchema);