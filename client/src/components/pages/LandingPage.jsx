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

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{
        height: '90vh',
        background: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '4rem', margin: 0 }}>Novusphere</h1>
        <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>
          Gateway to Emerging Tech Opportunities
        </p>
        <button
          onClick={handleApplyNow}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            fontSize: '1rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </header>

      {/* Upcoming Jobs */}
      <section style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Upcoming Opprtunities</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {upcomingJobs.map(job => (
            <div key={job._id} style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{job.title}</h3>
              <p style={{ color: '#475569', marginBottom: '5px' }}>{job.type}</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{job.description}</p>
              <p style={{ fontSize: '0.85rem', color: '#334155' }}>
                Deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Tagline and Apply Button */}
        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '500' }}>Interested? Apply Now</p>
          <button
            onClick={handleApplyNow}
            style={{
              marginTop: '10px',
              padding: '10px 25px',
              fontSize: '1rem',
              background: '#10b981', // Green color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Apply Now
          </button>
        </div>
      </section>

      {/* About Section */}
      <section style={{ background: '#f1f5f9', padding: '50px 20px', textAlign: 'center' }}>
        <h2>About Novusphere</h2>
        <p style={{ maxWidth: '700px', margin: '20px auto' }}>
          Novusphere is a dynamic platform designed to bring creative minds together to collaborate, innovate, and lead the future.
        </p>
      </section>

      {/* Features Section */}
      <section style={{ padding: '50px 20px', textAlign: 'center' }}>
        <h2>Features</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: '30px'
        }}>
          {['Connect', 'Innovate', 'Grow'].map((feature, idx) => (
            <div key={idx} style={{
              margin: '10px',
              padding: '20px',
              background: 'white',
              borderRadius: '10px',
              width: '250px',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
              <h3>{feature}</h3>
              <p>{feature === 'Connect' ? 'Meet innovators and changemakers.' :
                feature === 'Innovate' ? 'Build ideas and turn them into reality.' :
                'Learn, expand, and lead the future.'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', background: '#0f172a', color: 'white' }}>
        © 2025 Novusphere. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
