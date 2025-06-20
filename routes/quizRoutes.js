const express = require("express");
const router = express.Router();
const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  deleteQuiz,
  submitQuiz,
  getLeaderboard,
  getGlobalLeaderboard,
  getMyCertificates,
  getMyQuizAttempts,
  getQuizAttemptsByTeacher,
  toggleQuizPublish
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
router.get("/leaderboard/global", authMiddleware, getGlobalLeaderboard);
router.get("/certificates/me", authMiddleware, restrictTo(["student"]), getMyCertificates);
router.get("/:quizId/attempts/me", authMiddleware, restrictTo(["student"]), getMyQuizAttempts);
router.get("/:quizId/attempts", authMiddleware, restrictTo(["teacher"]), getQuizAttemptsByTeacher);
router.patch("/:id/toggle", authMiddleware, restrictTo(["teacher"]), toggleQuizPublish);




// Delete a quiz (only its creator)
router.delete("/:id", authMiddleware, restrictTo(["teacher"]), deleteQuiz);


module.exports = router;

