
const express = require("express");
const router = express.Router();
const {
    createCourse, getCourses, enrollInCourse, myCourses , deleteCourse
} = require("../controllers/courseController");
const auth = require("../middleware/authMiddleware");
const restrictTo = require("../middleware/roleMiddleware");

router.post("/", auth, restrictTo(["teacher"]), createCourse);     
router.get("/", auth, getCourses);                                
router.post("/:id/enroll", auth, restrictTo(["student"]), enrollInCourse); 
router.get("/mine", auth, myCourses);       

router.delete('/:id', auth, restrictTo(["teacher"]), deleteCourse);


module.exports = router;

