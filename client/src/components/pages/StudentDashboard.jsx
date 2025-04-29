import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './StudentDashboard.css'; // Link to external styles

Modal.setAppElement('#root');

const StudentDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('Hackathons');
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [error, setError] = useState('');

  const typeMap = {
    Hackathons: 'hackathon',
    Jobs: 'job',
    Internships: 'internship',
    Events: 'event',
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getjobs');
        setOpportunities(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch opportunities.');
      }
    };
    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter(
    (item) => item.type?.toLowerCase() === typeMap[selectedFilter]
  );

  const getUpcomingDeadlines = () => {
    const now = new Date();
    return opportunities
      .filter((item) => new Date(item.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  };

  const upcoming = getUpcomingDeadlines();
  const earliest = upcoming[0]?.id;

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome, John 👋</h1>
          <p className="dashboard-date">April 24, 2024</p>
        </div>

        <div className="dashboard-tabs">
          {Object.keys(typeMap).map((key) => (
            <span
              key={key}
              className={`tab ${selectedFilter === key ? 'active' : ''}`}
              onClick={() => setSelectedFilter(key)}
            >
              {key}
            </span>
          ))}
        </div>

        <div className="opportunity-grid">
          {filteredOpportunities.length === 0 ? (
            <p className="empty-text">Oops! Nothing available right now.</p>
          ) : (
            filteredOpportunities.map((item) => (
              <div
                key={item.id}
                className="opportunity-card"
                onClick={() => setSelectedOpportunity(item)}
              >
                <h3>{item.title}</h3>
                <p className="type">{item.type}</p>
                <p>{item.description}</p>
                <p className="deadline">
                  Deadline: {Math.ceil((new Date(item.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
                <button>Apply Now</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="dashboard-sidebar">
        <div className="chatbot-box">
          <h3>AI Chatbot</h3>
          <button>Ask a Question</button>
        </div>

        <div className="deadlines-box">
          <h3>Upcoming Deadlines</h3>
          {upcoming.map((item) => (
            <div
              key={item.id}
              className="deadline-item"
              onClick={() => setSelectedOpportunity(item)}
            >
              <p className={item.id === earliest ? 'highlight' : ''}>{item.title}</p>
              <p>{new Date(item.deadline).toDateString()}</p>
            </div>
          ))}
        </div>

        <div className="application-tracker">
          <h3>Application Tracker</h3>
          <div className="tracker-stats">
            <span>4 Applied</span>
            <span>2 In Review</span>
            <span>1 Shortlisted</span>
            <span>1 Rejected</span>
          </div>
        </div>

        <div className="discussion-forum">
          <h3>Discussion Forum</h3>
          <p>Join ongoing discussions with peers!</p>
        </div>
      </div>

      <Modal
        isOpen={!!selectedOpportunity}
        onRequestClose={() => setSelectedOpportunity(null)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedOpportunity && (
          <div className="modal-content">
            <h2>{selectedOpportunity.title}</h2>
            <p className="type">{selectedOpportunity.type}</p>
            <p>{selectedOpportunity.description}</p>
            <p>Deadline: {new Date(selectedOpportunity.deadline).toDateString()}</p>
            <button onClick={() => setSelectedOpportunity(null)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentDashboard;
