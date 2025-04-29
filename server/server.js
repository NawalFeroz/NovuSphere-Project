const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:3000', // React app running on port 3000
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

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://koppolsahithi:KZfoTd1MeDaMJQ25@cluster0.fhtmrse.mongodb.net/mernappdb?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// ✅ Create Job Schema
const JobSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  deadline: String,
});
const Job = mongoose.model('Job', JobSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

// SignIn route
app.post('/signin', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Invalid email domain. Please use your BVRIT Hyderabad email.' });
  }

  if (password !== '123456') {
    return res.status(400).json({ message: 'Invalid password. Please check your credentials.' });
  }

  try {
    const mockUser = {
      email,
      role,
      _id: new mongoose.Types.ObjectId(),
    };

    const token = jwt.sign({ userId: mockUser._id, role: mockUser.role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error occurred while processing your request.' });
  }
});

// ✅ New route to post a job
app.post('/postjob', async (req, res) => {
  const { title, type, description, deadline } = req.body;
  try {
    const newJob = new Job({ title, type, description, deadline });
    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error posting job' });
  }
});

// ✅ New route to get all jobs
app.get('/getjobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
