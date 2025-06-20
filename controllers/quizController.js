const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");
const Course = require("../models/Course");
const Certificate = require("../models/Certificate");

exports.createQuiz = async (req, res) => {
  try {
    const { title, course, questions,durations } = req.body;
    const quiz = new Quiz({
      title,
      course,
      questions,
      durations,
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

      const quizzes = await Quiz.find({
  course: { $in: enrolledCourseIds },
  isPublished: true 
}).populate("course", "title");

      const safeQuizzes = quizzes.map((quiz) => {
        const safeQuestions = quiz.questions.map(({ question, options }) => ({
          question,
          options
        }));

        return {
          ...quiz.toObject(),
          questions: safeQuestions
        };
      });

      return res.json(safeQuizzes);
    }

    // Teachers/admins see full quizzes
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

    // 🛡️ Restrict access if student is not enrolled
    if (req.user.role === "student") {
      const course = await Course.findById(quiz.course._id);
      if (!course.students.includes(req.user.id)) {
        return res.status(403).json({ error: "Not enrolled in this course" });
      }

      // ✂️ Remove correctAnswer from each question
      const safeQuiz = {
        ...quiz.toObject(),
        questions: quiz.questions.map(({ question, options }) => ({
          question,
          options
        }))
      };

      return res.json(safeQuiz);
    }

    res.json(quiz);
  } catch (err) {
    console.error("❌ Error in getQuizById:", err);
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

    const existingAttempt = await QuizAttempt.findOne({ quiz: quizId, user: req.user.id });
if (existingAttempt) {
  return res.status(400).json({ error: "You've already attempted this quiz" });
}
const quizStartTime = new Date(req.body.startedAt); // frontend sends this
const now = new Date();
const minutesTaken = (now - quizStartTime) / (1000 * 60);

if (quiz.duration && minutesTaken > quiz.duration) {
  return res.status(400).json({ error: "Quiz time limit exceeded" });
}

    let score = 0;
    const feedback = [];
   quiz.questions.forEach((q, idx) => {
      const isCorrect = q.correctAnswer === answers[idx];
      if (isCorrect) score++;

      feedback.push({
        question: q.question,
        yourAnswer: answers[idx],
        correctAnswer: q.correctAnswer,
        isCorrect
      });
    });

   const attempt = await QuizAttempt.create({
      quiz: quizId,
      user: req.user.id,
      answers,
      score
    });
    const percentage = (score / quiz.questions.length) * 100;
if (percentage >= 70) {
  await Certificate.create({
    quiz: quizId,
    course: quiz.course,
    student: req.user.id,
    score
  });
}

    res.json({
      message: "Quiz submitted",
      score,
      feedback,
      attempt
    });


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

    const top = await QuizAttempt.find()
  .sort({ score: -1, attemptedAt: 1 })
  .limit(10)
  .populate("user", "name email")
  .populate("quiz", "title");

  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const leaderboard = await QuizAttempt.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
          attempts: { $sum: 1 }
        }
      },
      { $sort: { totalScore: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          email: "$user.email",
          totalScore: 1,
          attempts: 1
        }
      }
    ]);

    res.json({ leaderboard });

  } catch (err) {
    console.error("❌ Global Leaderboard Error:", err);
    res.status(500).json({ error: "Failed to fetch global leaderboard" });
  }
}; 

exports.getMyQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;
    const attempts = await QuizAttempt.find({ quiz: quizId, user: req.user.id });

    res.json({ attempts });
  } catch (err) {
    console.error("❌ Error fetching quiz attempts:", err);
    res.status(500).json({ error: "Failed to fetch quiz attempts" });
  }
};

exports.getQuizAttemptsByTeacher = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // 🛡️ Only allow quiz creator to view attempts
    if (quiz.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view attempts" });
    }

    const attempts = await QuizAttempt.find({ quiz: quizId }).populate("user", "name email");
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attempts" });
  }
};


exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ student: req.user.id })
      .populate("quiz", "title")
      .populate("course", "title");

    res.json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch certificates" });
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

exports.toggleQuizPublish = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("course");
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // ✅ Only the course teacher can toggle it
    if (!quiz.course || quiz.course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    quiz.isPublished = !quiz.isPublished;
    await quiz.save();
    res.json({ message: `Quiz ${quiz.isPublished ? "published" : "unpublished"}` });
  } catch (err) {
    res.status(500).json({ error: "Toggle failed", details: err.message });
  }
};
