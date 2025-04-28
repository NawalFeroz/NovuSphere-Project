import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To navigate after successful sign-in

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // default role
  const [error, setError] = useState(null); // To display error messages
  const navigate = useNavigate();

  // Email validation function
  const isEmailValid = (email) => email.endsWith('@gmail.com');

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for empty fields
    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    // Check if email is valid
    if (!isEmailValid(email)) {
      setError('Please use a valid .');
      return;
    }

    // Check if password matches the common password
    const commonPassword = '123456';
    if (password !== commonPassword) {
      setError('Invalid password. Please use the correct password.');
      return;
    }

    try {
      // Make the API call to sign in
      const response = await axios.post("http://localhost:5000/signin", {
        email,
        password,
        role,
      },
      {
        withCredentials: false // Ensure cookies are not included
      });

      // If successful, store the token in localStorage (you can use cookies too)
      localStorage.setItem('token', response.data.token);

      if (role === 'student') {
        navigate('/StudentDashboard'); // Redirect to student dashboard
      }
      else{
        navigate('/FacultyDashboard'); // Redirect to faculty dashboard
      }
    } catch (err) {
      // Display error if the API call fails
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
