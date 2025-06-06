import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LandingPage() {
  const navigate = useNavigate();
  const [upcomingJobs, setUpcomingJobs] = useState([]);

  useEffect(() => {
    const fetchUpcomingJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getjobs');
        const now = new Date();
        const upcoming = response.data
          .filter(job => new Date(job.deadline) > now)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 3);
        setUpcomingJobs(upcoming);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchUpcomingJobs();
  }, []);

  const handleApplyNow = () => {
    navigate('/signin');
  };

  const darkBackground = '#0d1117';  // GitHub dark bg
  const darkTextColor = '#c9d1d9';   // GitHub light text
  const cardBackground = '#161b22';  // Slightly lighter card bg
  const buttonBlue = '#238636';      // Greenish-blue button color like GitHub's "green"
  const buttonHover = '#2ea043';

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: darkBackground, color: darkTextColor, minHeight: '100vh' }}>
      <header style={{
        minHeight: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '5rem', margin: 0, fontWeight: '800' }}>Novusphere</h1>
        <p style={{ fontSize: '1.5rem', marginTop: '10px', fontWeight: '400' }}>
          Gateway to Emerging Tech Opportunities
        </p>
      </header>

      {/* Upcoming Opportunities */}
      <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', fontWeight: '600', borderBottom: `1px solid ${darkTextColor}`, paddingBottom: '10px' }}>Upcoming Opportunities</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {upcomingJobs.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#8b949e' }}>No upcoming opportunities available.</p>
          )}
          {upcomingJobs.map(job => (
            <div key={job._id} style={{
              background: cardBackground,
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 12px rgb(0 0 0 / 0.5)',
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '700' }}>{job.title}</h3>
              <p style={{ color: '#8b949e', marginBottom: '10px', fontWeight: '500' }}>{job.type}</p>
              <p style={{ fontSize: '1rem', marginBottom: '15px', lineHeight: '1.4', color: '#c9d1d9' }}>{job.description}</p>
              <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign In + Apply Now */}
      <section style={{ textAlign: 'center', padding: '30px 20px', maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '15px' }}>Sign in to apply now</p>
        <button
          onClick={handleApplyNow}
          style={{
            padding: '12px 40px',
            fontSize: '1.25rem',
            fontWeight: '600',
            backgroundColor: buttonBlue,
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHover}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonBlue}
        >
          Apply Now
        </button>
      </section>

      {/* About Section */}
      <section style={{ background: '#161b22', padding: '50px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: '600', fontSize: '2rem' }}>About Novusphere</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: darkTextColor, fontSize: '1.1rem', lineHeight: '1.6' }}>
          Novusphere is a dynamic platform designed to bring creative minds together to collaborate, innovate, and lead the future.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', background: darkBackground, color: '#8b949e', fontSize: '0.9rem' }}>
        © 2025 Novusphere. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
