const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require('./routes/quizRoutes');



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/", (req, res) => res.send("🎓 Quiz App API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
