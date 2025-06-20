const Course = require("../models/Course");
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const User = require("../models/User");


exports.studentDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ students: req.user.id }).lean();

    const quizzes = await Quiz.find({ course: { $in: courses.map(c => c._id) } }).lean();

    const attempts = await QuizAttempt.find({ user: req.user.id });

    const progress = quizzes.map((quiz) => {
      const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
      return {
        quizTitle: quiz.title,
        course: quiz.course,
        attempted: !!attempt,
        score: attempt ? attempt.score : null,
      };
    });

    res.json({ courses, progress });
  } catch (err) {
    console.error("❌ Student Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load student dashboard" });
  }
};

exports.viewStudentDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;

    
    const studentUser = await User.findById(studentId);
    if (!studentUser || studentUser.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    const courses = await Course.find({ students: studentId }).lean();
    const quizzes = await Quiz.find({ course: { $in: courses.map(c => c._id) } }).lean();
    const attempts = await QuizAttempt.find({ user: studentId });

    const progress = quizzes.map((quiz) => {
      const attempt = attempts.find(a => a.quiz.toString() === quiz._id.toString());
      return {
        quizTitle: quiz.title,
        course: quiz.course,
        attempted: !!attempt,
        score: attempt ? attempt.score : null,
      };
    });

    res.json({
      studentId,
      studentName: studentUser.name,
      courses,
      progress
    });
  } catch (err) {
    console.error("❌ Teacher View Student Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load student dashboard" });
  }
};

exports.teacherDashboard = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id }).lean();

    const courseIds = courses.map(c => c._id);

    const quizzes = await Quiz.find({ course: { $in: courseIds } }).lean();

    const attempts = await QuizAttempt.find({ quiz: { $in: quizzes.map(q => q._id) } });

    const overview = courses.map(course => {
      const courseQuizzes = quizzes.filter(q => q.course.toString() === course._id.toString());
      const enrolledCount = course.students.length;
      const totalQuizzes = courseQuizzes.length;

      return {
        courseTitle: course.title,
        enrolledCount,
        totalQuizzes,
      };
    });

    res.json({ courses: overview });
  } catch (err) {
    console.error("❌ Teacher Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load teacher dashboard" });
  }
};

exports.getStudentAnalytics = async (req, res) => {
  const userId = req.user.id;
  try {
    const attempts = await QuizAttempt.find({ user: userId }).populate("quiz", "title");
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

exports.getStudentAnalyticsById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    const attempts = await QuizAttempt.find({ user: userId }).populate("quiz", "title");
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student analytics" });
  }
};
