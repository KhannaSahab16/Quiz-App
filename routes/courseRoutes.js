// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const {
  createCourse, getCourses, enrollInCourse, myCourses
} = require("../controllers/courseController");
const auth = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

router.post("/", auth, restrictTo(["teacher"]), createCourse);     // Only teacher
router.get("/", auth, getCourses);                                // Everyone
router.post("/:id/enroll", auth, restrictTo(["student"]), enrollInCourse); // Only student
router.get("/mine", auth, myCourses);                             // My courses

module.exports = router;

