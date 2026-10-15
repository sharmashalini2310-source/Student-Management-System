# Student Management System - MongoDB Version

## Technology
Frontend: HTML, CSS, Bootstrap, JavaScript
Backend: Node.js + Express.js
Database: MongoDB + Mongoose
API testing: Postman

## Setup
1. Install Node.js.
2. Install MongoDB Community Server and make sure MongoDB is running, or use MongoDB Atlas.
3. Open this project in VS Code.
4. Run: npm install
5. Copy `.env.example` to `.env`.
6. For local MongoDB keep: MONGODB_URI=mongodb://127.0.0.1:27017/student_management
7. Run: npm start
8. Open http://localhost:3000

## Main REST APIs
POST /api/register
POST /api/login
POST /api/logout
GET /api/me
PUT /api/profile
GET /api/dashboard
GET /api/students
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id

Login first in the website or Postman. The session cookie is then used for protected APIs.
