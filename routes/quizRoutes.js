const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  submitQuiz,
  getLeaderboard,
} = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

// Create a quiz (Teacher only)
router.post("/", authMiddleware, restrictTo(["teacher"]), createQuiz);

// Get all quizzes (optionally by course)
router.get("/", authMiddleware, getAllQuizzes);

// Get single quiz by ID
router.get("/:id", authMiddleware, getQuizById);
// routes/quizRoutes.js
router.post("/:quizId/attempt", authMiddleware, restrictTo(["student"]), submitQuiz);
router.get("/:quizId/leaderboard", authMiddleware, getLeaderboard);


// Delete a quiz (only its creator)
router.delete("/:id", authMiddleware, restrictTo(["teacher"]), deleteQuiz);


module.exports = router;

