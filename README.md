# 🧠 MERN Education Platform Backend (API-Only)

Robust Node.js backend for a full-fledged education + quiz platform with **JWT Auth**, **role-based dashboards**, **course management**, **quiz creation**, **scoring**, **leaderboards**, and **student performance tracking**.

> ✅ Built from scratch using **Node.js**, **Express**, and **MongoDB**, this backend powers student-teacher interaction for an interactive learning platform. Designed for **clarity, security, and extensibility.**

---

## 🚀 Features

### 🔐 Auth System

* ✅ Secure **JWT-based login & registration**
* ✅ Roles: `student`, `teacher`
* ✅ Role-based route access (middleware protected)

### 🎓 Course Management

* 👨‍🏫 **Teachers** can create, manage their courses
* 👩‍🎓 **Students** can enroll only via backend-auth

### ❓ Quiz Engine

* 📝 Teachers can create quizzes:

  * Add any number of questions
  * Associate them with existing courses
  * Control visibility (draft / publish)
* 🔍 Students can:

  * View only enrolled course quizzes
  * Take quiz **once** (attempt restriction)
  * Receive immediate scoring
  * Recieve Certificate if passed threshold criteria

### 🏆 Leaderboards

* ✅ Quiz-specific leaderboard
* ✅ Global leaderboard across all quizzes

### 📊 Student Dashboard

* ✅ View enrolled courses
* ✅ View available quizzes
* ✅ View attempt score history
* ✅ View per-quiz attempt feedback

### 📈 Teacher Dashboard

* ✅ View all created courses
* ✅ View quizzes with stats (students, attempts)
* ✅ Access any student’s dashboard via dropdown
* ✅ Monitor class performance

---

## 📁 Project Structure

```
📦 Quiz-App-Backend
├── controllers/
│   ├── authController.js
│   ├── courseController.js
│   ├── quizController.js
│   └── dashboardController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Quiz.js
│   └── QuizAttempt.js
│   └── Certificate.js
├── routes/
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   ├── quizRoutes.js
│   └── dashboardRoutes.js
├── server.js
└── config/
    └── db.js
└── utils/
    └── tokenUtils.js
```

---

## ⚙️ Tech Stack

| Layer      | Tech Used                    |
| ---------- | ---------------------------- |
| Language   | JavaScript (ES6)             |
| Backend    | Node.js + Express            |
| Database   | MongoDB + Mongoose ORM       |
| Auth       | JWT Tokens                   |
| Role Guard | Middleware based restriction |
| Testing    | Postman     |

---

## 🔒 Authentication Flow

```
/api/auth/register → create account
/api/auth/login    → returns token + user info

🔐 All routes except login/register are protected.
🔐 Student/Teacher routes have role guard.
```

---

## 🔄 API Overview

| Method | Route                             | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| POST   | /api/auth/register                | Register as student/teacher     |
| POST   | /api/auth/login                   | Login, returns JWT              |
| POST   | /api/courses/\:id/enroll          | Student enrolls in course       |
| GET    | /api/courses                      | View all courses (by role)      |
| POST   | /api/quizzes                      | Create a quiz (teacher)         |
| GET    | /api/quizzes                      | Get available quizzes (by role) |
| GET    | /api/quizzes/\:id                 | Get specific quiz               |
| POST   | /api/quizzes/\:quizId/attempt     | Submit a quiz                   |
| GET    | /api/quizzes/\:quizId/leaderboard | Quiz leaderboard                |
| GET    | /api/leaderboard/global           | Global leaderboard              |
| GET    | /api/dashboard/student            | Student’s own dashboard         |
| GET    | /api/dashboard/\:id/student       | Teacher views any student       |

---

## 🧪 How to Test

1. Clone the repo and run:

```bash
npm install
npm run dev
```

2. Use **Postman** to:

   * Register/login as both roles
   * Create course (teacher)
   * Enroll (student)
   * Create quiz
   * Attempt quiz (once!)
   * Check leaderboard & dashboard routes

---

## 💡 Possible Extensions

* ✅ **Draft/Publish quizzes**
* ✅ **One attempt per student**
* ✅ **Quiz feedback (per question)**
* ✅ **Global leaderboard**
* 🔜 **Email report to student after attempt**
* 🔜 **Auto-expiring quizzes**
* 🔜 **Tag-based quiz filters**

---

## 👥  Author

Built by **Mehul Khanna**

💪 Personal backend internship project + hackathon submission-ready.

Crafted with ❤️, caffeine, and hundreds of test requests.

---


