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

router.post("/", authMiddleware, restrictTo(["teacher"]), createQuiz);
router.get("/", authMiddleware, getAllQuizzes);
router.get("/:id", authMiddleware, getQuizById);
router.post("/:quizId/attempt", authMiddleware, restrictTo(["student"]), submitQuiz);
router.get("/:quizId/leaderboard", authMiddleware, getLeaderboard);
router.get("/leaderboard/global", authMiddleware, getGlobalLeaderboard);
router.get("/certificates/me", authMiddleware, restrictTo(["student"]), getMyCertificates);
router.get("/:quizId/attempts/me", authMiddleware, restrictTo(["student"]), getMyQuizAttempts);
router.get("/:quizId/attempts", authMiddleware, restrictTo(["teacher"]), getQuizAttemptsByTeacher);
router.patch("/:id/toggle", authMiddleware, restrictTo(["teacher"]), toggleQuizPublish);
router.delete("/:id", authMiddleware, restrictTo(["teacher"]), deleteQuiz);


module.exports = router;

