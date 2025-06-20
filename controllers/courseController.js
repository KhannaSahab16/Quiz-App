
const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = await Course.create({
      title,
      description,
      teacher: req.user.id
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: "Failed to create course" });
  }
};

exports.getCourses = async (req, res) => {
  const courses = await Course.find().populate("teacher", "name email");
  res.json(courses);
};

exports.enrollInCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  if (course.students.includes(req.user.id))
    return res.status(400).json({ error: "Already enrolled" });

  course.students.push(req.user.id);
  await course.save();
  res.json({ message: "Enrolled successfully" });
};

exports.myCourses = async (req, res) => {
  let courses;
  if (req.user.role === "student") {
    courses = await Course.find({ students: req.user.id });
  } else if (req.user.role === "teacher") {
    courses = await Course.find({ teacher: req.user.id });
  }
  res.json(courses);
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this course" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted" });

  } catch (err) {
    console.error("❌ Error deleting course:", err);
    res.status(500).json({ error: "Failed to delete course", details: err.message });
  }
};