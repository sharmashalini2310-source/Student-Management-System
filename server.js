require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'student-management-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 4 }
}));
app.use(express.static(path.join(__dirname, 'public')));

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, default: '', trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});
const studentSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, default: '', trim: true },
  course: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 12 },
  division: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);
const Student = mongoose.model('Student', studentSchema);

function auth(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Please login first.' });
  next();
}
function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, username, password, mobile } = req.body;
    if (!fullName || !email || !username || !password) return res.status(400).json({ message: 'Full name, email, username and password are required.' });
    if (!validEmail(email)) return res.status(400).json({ message: 'Enter a valid email.' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must contain at least 6 characters.' });
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (exists) return res.status(409).json({ message: 'Email or username already exists.' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, username, mobile, password: hash, role: 'admin' });
    req.session.userId = user._id.toString();
    res.status(201).json({ message: 'Registration successful.' });
  } catch (err) { res.status(500).json({ message: 'Registration failed.', error: err.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Invalid username or password.' });
    req.session.userId = user._id.toString();
    res.json({ message: 'Login successful.', user: { id: user._id, fullName: user.fullName, username: user.username, role: user.role } });
  } catch (err) { res.status(500).json({ message: 'Login failed.', error: err.message }); }
});

app.post('/api/logout', (req, res) => req.session.destroy(() => res.json({ message: 'Logged out.' })));
app.get('/api/me', auth, async (req, res) => {
  const user = await User.findById(req.session.userId).select('-password');
  if (!user) return res.status(401).json({ message: 'User not found.' });
  res.json(user);
});
app.put('/api/profile', auth, async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body;
    const duplicate = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.session.userId } });
    if (duplicate) return res.status(409).json({ message: 'Email already used by another account.' });
    const user = await User.findByIdAndUpdate(req.session.userId, { fullName, email, mobile }, { new: true }).select('-password');
    res.json({ message: 'Profile updated.', user });
  } catch (err) { res.status(500).json({ message: 'Profile update failed.', error: err.message }); }
});

app.get('/api/students', auth, async (req, res) => {
  try { res.json(await Student.find().sort({ createdAt: -1 })); }
  catch (err) { res.status(500).json({ message: 'Could not load students.' }); }
});
app.post('/api/students', auth, async (req, res) => {
  try {
    const { enrollmentNo, fullName, email, mobile, course, semester, division } = req.body;
    if (!enrollmentNo || !fullName || !email || !course || !semester) return res.status(400).json({ message: 'Enrollment, name, email, course and semester are required.' });
    const student = await Student.create({ enrollmentNo, fullName, email, mobile, course, semester, division });
    res.status(201).json({ message: 'Student added successfully.', student });
  } catch (err) {
    res.status(err.code === 11000 ? 409 : 500).json({ message: err.code === 11000 ? 'Enrollment number already exists.' : 'Could not add student.', error: err.message });
  }
});
app.put('/api/students/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    res.json({ message: 'Student updated successfully.', student });
  } catch (err) { res.status(400).json({ message: 'Could not update student.', error: err.message }); }
});
app.delete('/api/students/:id', auth, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found.' });
    res.json({ message: 'Student deleted successfully.' });
  } catch (err) { res.status(400).json({ message: 'Could not delete student.' }); }
});
app.get('/api/dashboard', auth, async (req, res) => {
  const total = await Student.countDocuments();
  const courses = await Student.distinct('course');
  const semesters = await Student.distinct('semester');
  res.json({ totalStudents: total, totalCourses: courses.length, totalSemesters: semesters.length });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

mongoose.connect(MONGODB_URI).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}).catch(err => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
