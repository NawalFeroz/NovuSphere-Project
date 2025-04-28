const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');  // Add CORS support

const app = express();
app.use(express.json());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ limit: '100kb', extended: true }));
// Enable CORS for requests from the client (React frontend)
const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
  allowedHeaders: 'Content-Type, Authorization',  // Allowed headers
  credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.clearCookie('unnecessarytoken'); // Clear the token cookie on every request
  next();
});

// Connect to MongoDB (optional for now, mock user data is used)
// mongoose.connect('mongodb://localhost/novusphere', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log('MongoDB connection error:', err));

// Common password for authentication
const commonPassword = '123456';

// Root route (to test if API is running)
app.get('/', (req, res) => {
  res.json({ message: 'API is running successfully' });
});

// SignIn route
app.post('/signin', async (req, res) => {
  const { email, password, role } = req.body;

  // Email domain validation (only allow BVRIT Hyderabad emails)
  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Invalid email domain. Please use your BVRIT Hyderabad email.' });
  }

  // Password validation (check against a predefined common password)
  if (password !== '123456') {
    return res.status(400).json({ message: 'Invalid password. Please check your credentials.' });
  }

  try {
    // Simulate a user (in a real app, this would query the database for the user)
    const mockUser = {
      email,
      role,
      _id: new mongoose.Types.ObjectId(),
    };

    // Generate JWT token
    const token = jwt.sign({ userId: mockUser._id, role: mockUser.role }, 'your_jwt_secret', { expiresIn: '1h' });

    // Respond with a success message and the token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error occurred while processing your request.' });
  }
});

// Start server on port 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
