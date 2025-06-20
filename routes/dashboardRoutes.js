const express = require("express");
const router = express.Router();
const { studentDashboard, teacherDashboard, viewStudentDashboard, getStudentAnalytics ,getStudentAnalyticsById} = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

router.get("/student", authMiddleware,studentDashboard);
router.get("/student/:id", authMiddleware, restrictTo(["teacher"]), viewStudentDashboard);

router.get("/teacher", authMiddleware, restrictTo(["teacher"]), teacherDashboard);
console.log("👉 Handler is:", getStudentAnalytics);
router.get("/me/analytics", authMiddleware, restrictTo(["student"]), getStudentAnalytics);
router.get("/students/:id/analytics", authMiddleware, restrictTo(["teacher"]), getStudentAnalyticsById);
module.exports = router;