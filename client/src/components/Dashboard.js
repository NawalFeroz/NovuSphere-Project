import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token is found, redirect to the sign-in page
      navigate('/signin');
    } else {
      // Optionally, you can fetch user data from the backend if needed
      // For simplicity, we're just setting a mock user here
      setUser({ name: 'John Doe', role: 'Student' });
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <h2>Welcome to your Dashboard</h2>
      {user ? (
        <div>
          <p>Hello, {user.name}</p>
          <p>Your role: {user.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
