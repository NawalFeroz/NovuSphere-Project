const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
app.use(cors(corsOptions));

// Clear unnecessary token cookie
app.use((req, res, next) => {
  res.clearCookie('unnecessarytoken');
  next();
});

// Connect to MongoDB
mongoose.connect(
  'mongodb+srv://koppolsahithi:KZfoTd1MeDaMJQ25@cluster0.fhtmrse.mongodb.net/mernappdb?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Job Schema
const JobSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  link: String,
  deadline: String,
});
const Job = mongoose.model('Job', JobSchema);

// Status Schema for per-user status map
const StatusSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: Map, of: String, default: {} },
});
const Status = mongoose.model('Status', StatusSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

// SignIn route
app.post('/signin', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Invalid email domain.' });
  }
  if (password !== '123456') {
    return res.status(400).json({ message: 'Invalid password.' });
  }

  try {
    const mockUser = {
      email,
      role,
      _id: new mongoose.Types.ObjectId(),
    };

    // ✅ Include email in token
    const token = jwt.sign(
      { userId: mockUser._id, role: mockUser.role, email: mockUser.email },
      'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error occurred.' });
  }
});

// Post a job
app.post('/postjob', async (req, res) => {
  const { title, type, description, link, deadline } = req.body;
  try {
    const newJob = new Job({ title, type, description, link, deadline });
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error posting job' });
  }
});

// Get all jobs
app.get('/getjobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Delete a job
app.delete('/deletejob/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// Get status map for a user
app.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const userStatus = await Status.findOne({ email });
    if (userStatus) {
      res.json({ status: Object.fromEntries(userStatus.status) });
    } else {
      res.json({ status: {} });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching status' });
  }
});

// Update status map for a user
app.post('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { status } = req.body;

    const statusMap = new Map(Object.entries(status));

    const userStatus = await Status.findOneAndUpdate(
      { email },
      { status: statusMap },
      { upsert: true, new: true }
    );

    res.json({ message: 'Status updated', status: Object.fromEntries(userStatus.status) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating status' });
  }
});

app.listen(5000, () => {
  console.log('🚀 Server running on http://localhost:5000');
});
