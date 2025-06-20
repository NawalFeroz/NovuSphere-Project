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
        const upcoming = await Promise.all(
          response.data
            .filter(job => new Date(job.deadline) > now)
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3)
            .map(async (job) => {
              let content = '';
              try {
                const scrapeResponse = await axios.post('http://localhost:5000/scrape-summary', { url: job.link });
                content = scrapeResponse.data.summary || 'No description available.';
              } catch (err) {
                console.error('Scraping failed for:', job.link);
              }
              return { ...job, description: content };
            })
        );
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

  const handleLogin = () => {
    navigate('/signin');
  };

  const darkBackground = '#0d1117';
  const darkTextColor = '#c9d1d9';
  const cardBackground = '#161b22';
  const buttonBlue = '#238636';
  const buttonHover = '#2ea043';

  return (
    <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: darkBackground, color: darkTextColor, minHeight: '100vh' }}>
      <header style={{
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: '#1f2937',
        position: 'relative'
      }}>
        <button
          onClick={handleLogin}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: '800' }}>Novusphere</h1>
        <p style={{ fontSize: '1.5rem', marginTop: '10px', fontWeight: '400', maxWidth: '600px' }}>
          Discover, Compete, and Elevate Your Career through Tech Events & Hackathons
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
            <a
              key={job._id}
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                style={{
                  background: cardBackground,
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgb(0 0 0 / 0.5)',
                  cursor: 'pointer'
                }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', fontWeight: '700' }}>{job.title}</h3>
                <p><strong>Event Company:</strong> {job.company || 'N/A'}</p>
                <p><strong>Event Type:</strong> {job.type}</p>
                <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                <p style={{ color: '#58a6ff', marginTop: '10px' }}><em>Click to know more</em></p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Bar */}
      <section style={{
        background: '#1f2937',
        padding: '30px 20px',
        textAlign: 'center',
        color: '#ffffff',
        borderTop: '1px solid #2d333b',
        borderBottom: '1px solid #2d333b',
        margin: '40px 0'
      }}>
        <h2 style={{ marginBottom: '10px', fontSize: '1.8rem', fontWeight: '600' }}>Want to apply? Sign in now</h2>
        <button
          onClick={() => navigate('/signin')}
          style={{
            marginTop: '15px',
            padding: '10px 30px',
            fontSize: '1rem',
            fontWeight: '600',
            backgroundColor: '#2563eb',
            border: 'none',
            borderRadius: '6px',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#3b82f6'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          Sign In
        </button>
      </section>

      {/* About Section */}
      <section style={{ background: '#161b22', padding: '50px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <h2 style={{ marginBottom: '20px', fontWeight: '600', fontSize: '2rem' }}>Why Choose Novusphere?</h2>
        <p style={{ maxWidth: '700px', margin: '0 auto', color: darkTextColor, fontSize: '1.1rem', lineHeight: '1.6' }}>
          From discovering groundbreaking hackathons and competitions to forming winning teams and getting hired by top tech companies, Novusphere is your one-stop destination to make your mark in the tech world. Join a growing community that thrives on collaboration, innovation, and opportunity.
        </p>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px', textAlign: 'center', background: darkBackground, color: '#8b949e', fontSize: '0.9rem' }}>
        © {new Date().getFullYear()} Nawal Feroz , Srihitha Reddy , KVS Sahithi
      </footer>
     
    </div>
  );
}

export default LandingPage;
