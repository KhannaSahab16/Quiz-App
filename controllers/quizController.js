const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");

const Course = require("../models/Course");


exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions } = req.body;
    const quiz = new Quiz({
      title,
      course,
      questions,
      createdBy: req.user.id
    });

    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ error: "Failed to create quiz", details: err.message });
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const user = req.user;

    if (user.role === "student") {
      const enrolledCourses = await Course.find({ students: user.id }).select("_id");
      const enrolledCourseIds = enrolledCourses.map((c) => c._id);

      const quizzes = await Quiz.find({ course: { $in: enrolledCourseIds } }).populate("course", "title");
      return res.json(quizzes);
    }

    // Teachers/admins see all quizzes
    const filter = req.query.course ? { course: req.query.course } : {};
    const quizzes = await Quiz.find(filter).populate("course", "title");
    res.json(quizzes);
  } catch (err) {
    console.error("❌ Error in getAllQuizzes:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("course", "title");

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // 🛡️ Restrict access to students not enrolled
    if (req.user.role === "student") {
      const course = await Course.findById(quiz.course._id);

      if (!course.students.includes(req.user.id)) {
        return res.status(403).json({ error: "Not enrolled in this course" });
      }
    }

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};
// controllers/quizController.js
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quizId = req.params.quizId; // ✅ Get quizId from URL

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (q.correctAnswer === answers[idx]) score++;
    });

    const attempt = await QuizAttempt.create({
      quiz: quizId,
      user: req.user.id,
      answers,
      score,
    });

    res.json({ message: "Quiz submitted", score, attempt });

  } catch (err) {
    console.error("❌ Error submitting quiz:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
};
// controllers/quizController.js
exports.getLeaderboard = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const attempts = await QuizAttempt.find({ quiz: quizId })
      .sort({ score: -1, attemptedAt: 1 })
      .populate("user", "name email");

    res.json({ leaderboard: attempts });
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
  const quiz = await Quiz.findById(req.params.id).populate("course");

  if (!quiz) return res.status(404).json({ error: "Quiz not found" });

  if (!quiz.course || quiz.course.teacher.toString() !== req.user.id) {
    return res.status(403).json({ error: "Not authorized to delete this quiz" });
  }

  await quiz.deleteOne();
  res.json({ message: "Quiz deleted" });

} catch (err) {
  console.error("❌ Delete quiz error:", err);
  res.status(500).json({ error: "Failed to delete quiz", details: err.message });
}

};
