const express = require("express");
const router = express.Router();
const { studentDashboard, teacherDashboard, viewStudentDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

router.get("/student", authMiddleware,studentDashboard);
router.get("/student/:id", authMiddleware, restrictTo(["teacher"]), viewStudentDashboard);

router.get("/teacher", authMiddleware, restrictTo(["teacher"]), teacherDashboard);

module.exports = router;