import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom

function LandingPage() {
  const navigate = useNavigate(); // Creating a navigate function

  const handleGetStarted = () => {
    navigate('/signin'); // Navigating to the '/signin' page when the button is clicked
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ height: '90vh', background: '#0f172a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', margin: '0' }}>Welcome to Novusphere</h1>
        <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>A new world of innovation and collaboration</p>
        <button
          onClick={handleGetStarted} // On click, call the handleGetStarted function
          style={{ marginTop: '30px', padding: '10px 20px', fontSize: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Get Started
        </button>
      </header>

      <section style={{ padding: '50px 20px', textAlign: 'center' }}>
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
