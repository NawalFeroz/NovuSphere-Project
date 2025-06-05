import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);

  useEffect(() => {
    // Fetch jobs and filter upcoming deadlines
    axios.get('http://localhost:5000/getjobs')
      .then(res => {
        const now = new Date();
        const upcoming = res.data
          .filter(job => new Date(job.deadline) > now)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 3);
        setUpcomingDeadlines(upcoming);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const handleApplyNow = () => {
    navigate('/signin');
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ height: '90vh', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', margin: '0' }}>Novusphere</h1>
        <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>Gateway to Emerging tech opportunities</p>
        <button
          onClick={handleApplyNow}
          style={{ marginTop: '30px', padding: '10px 20px', fontSize: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Apply Now
        </button>
      </header>

      <section style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h2>Upcoming Deadlines</h2>
        {upcomingDeadlines.length === 0 ? (
          <p>No upcoming opportunities.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {upcomingDeadlines.map(event => (
              <li key={event._id} style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>
                <strong>{event.title}</strong> - Deadline: {new Date(event.deadline).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: '30px', fontSize: '1.3rem' }}>Interested? Apply Now</p>
        <button
          onClick={handleApplyNow}
          style={{ marginTop: '10px', padding: '10px 30px', fontSize: '1.1rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Apply Now
        </button>
      </section>

      <section style={{ background: '#f1f5f9', padding: '50px 20px', textAlign: 'center' }}>
        <h2>About Novusphere</h2>
        <p style={{ maxWidth: '700px', margin: '20px auto' }}>
          Novusphere is a dynamic platform designed to bring creative minds together to collaborate, innovate, and lead the future.
        </p>
      </section>

      <section style={{ background: '#f1f5f9', padding: '50px 20px', textAlign: 'center' }}>
        <h2>Features</h2>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', marginTop: '30px' }}>
          <div style={{ margin: '10px', padding: '20px', background: 'white', borderRadius: '10px', width: '250px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h3>Connect</h3>
            <p>Meet innovators and changemakers.</p>
          </div>
          <div style={{ margin: '10px', padding: '20px', background: 'white', borderRadius: '10px', width: '250px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h3>Innovate</h3>
            <p>Build ideas and turn them into reality.</p>
          </div>
          <div style={{ margin: '10px', padding: '20px', background: 'white', borderRadius: '10px', width: '250px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <h3>Grow</h3>
            <p>Learn, expand, and lead the future.</p>
          </div>
        </div>
      </section>

      <footer style={{ padding: '20px', textAlign: 'center', background: '#0f172a', color: 'white' }}>
        © 2025 Novusphere. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
