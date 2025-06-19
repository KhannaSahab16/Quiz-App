const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [{ type: Number, required: true }], 
  score: Number,
  attemptedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);