import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [allOpportunities, setAllOpportunities] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    axios.get('http://localhost:5000/getjobs')
      .then((res) => setAllOpportunities(res.data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  const getFiltered = () => {
    if (filter === 'All') return allOpportunities;
    return allOpportunities.filter(item => item.type?.toLowerCase() === filter.toLowerCase());
  };

  const getUpcoming = () => {
    const now = new Date();
    return [...allOpportunities]
      .filter(item => new Date(item.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 2);
  };

  const filteredItems = getFiltered();
  const upcoming = getUpcoming();

  return (
    <div className="dashboard-container">
      {/* Main Section */}
      <div className="dashboard-main">
        <h1 className="dashboard-title">Explore Opportunities</h1>

        {/* Filter Tabs */}
        <div className="dashboard-tabs">
          {['All', 'Job', 'Hackathon', 'College Event'].map(type => (
            <span
              key={type}
              onClick={() => setFilter(type)}
              className={`tab ${filter === type ? 'active' : ''}`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="opportunity-grid">
          {filteredItems.length === 0 ? (
            <p>No opportunities available.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="opportunity-card">
                <h3>{item.title}</h3>
                <p className="type">{item.type}</p>
                <p>{item.description}</p>
                <p className="deadline">
                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                </p>
                {/* Link Button */}
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="apply-button"
                  >
                    Apply Now
                  </a>
                ) : (
                  <button disabled className="apply-button disabled">
                    No Link Available
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="deadlines-box">
          <h3>Upcoming Deadlines</h3>
          {upcoming.length === 0 ? (
            <p>No upcoming events.</p>
          ) : (
            upcoming.map(event => (
              <div key={event._id} className="deadline-item">
                <p className="highlight">{event.title}</p>
                <p>{new Date(event.deadline).toDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
