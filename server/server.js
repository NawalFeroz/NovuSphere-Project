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

// MongoDB connection
mongoose.connect(
  'mongodb+srv://koppolsahithi:KZfoTd1MeDaMJQ25@cluster0.fhtmrse.mongodb.net/mernappdb?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Schemas
const JobSchema = new mongoose.Schema({
  title: String,
  type: String,
  description: String,
  link: String,
  deadline: String,
});
const Job = mongoose.model('Job', JobSchema);

const StatusSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: Map, of: String, default: {} },
});
const Status = mongoose.model('Status', StatusSchema);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

// SignIn
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

// Job CRUD
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

app.get('/getjobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching jobs' });
  }
});

app.delete('/deletejob/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: 'Error deleting job' });
  }
});

// Status routes
app.get('/status/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const userStatus = await Status.findOne({ email });
    res.json({ status: userStatus ? Object.fromEntries(userStatus.status) : {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching status' });
  }
});

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

// Utility
function generateStudentEmails(start, end) {
  const emails = [];
  for (let i = start; i <= end; i++) {
    const numStr = i.toString().padStart(4, '0');
    emails.push(`22wh1a${numStr}@gmail.com`);
  }
  return emails;
}

// ✅ Fixed /job-stats route
app.get('/job-stats', async (req, res) => {
  try {
    const jobs = await Job.find();
    const statuses = await Status.find();
    const fullEmailList = generateStudentEmails(1201, 1265);

    const jobStats = jobs.map(job => {
      const jobId = job._id.toString();

      const appliedEmails = [];
      const qualifiedEmails = [];
      const wonEmails = [];

      statuses.forEach(userStatus => {
        const statusMap = userStatus.status instanceof Map
          ? userStatus.status
          : new Map(Object.entries(userStatus.status));

        const jobStatus = statusMap.get(jobId);

        if (jobStatus === 'applied') appliedEmails.push(userStatus.email);
        else if (jobStatus === 'qualified') qualifiedEmails.push(userStatus.email);
        else if (jobStatus === 'won') wonEmails.push(userStatus.email);
      });

      const allMarked = new Set([...appliedEmails, ...qualifiedEmails, ...wonEmails]);
      const pending = fullEmailList.filter(email => !allMarked.has(email));

      return {
        _id: jobId,
        title: job.title,
        applied: appliedEmails.length,
        qualified: qualifiedEmails.length,
        won: wonEmails.length,
        pending,
        appliedEmails,
        qualifiedEmails,
        wonEmails,
      };
    });

    res.json(jobStats);
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({ message: 'Failed to get job statistics' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
