import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const token = localStorage.getItem('token');

  // Decode JWT to get email
  let email = 'guest';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    email = payload.email;
  } catch (err) {
    console.warn('Invalid token or no email in token');
  }

  const [allOpportunities, setAllOpportunities] = useState([]);
  const [filter, setFilter] = useState('All');
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/getjobs')
      .then(res => setAllOpportunities(res.data))
      .catch(err => console.error('Fetch jobs error:', err));

    // Fetch user-specific status
    axios.get(`http://localhost:5000/status/${email}`)
      .then(res => {
        if (res.data.status) setStatusMap(res.data.status);
      })
      .catch(err => console.error('Fetch status error:', err));
  }, [email]);

  const updateStatus = (id, status) => {
    const updated = { ...statusMap, [id]: status };
    setStatusMap(updated);

    axios.post(`http://localhost:5000/status/${email}`, { status: updated })
      .then(() => console.log('Status saved'))
      .catch(err => console.error('Error saving status:', err));
  };

  const getFiltered = () => {
    let items = [...allOpportunities];
    if (filter === 'Applied') {
      items = items.filter(item => statusMap[item._id] === 'applied');
    } else if (filter === 'Pending') {
      items = items.filter(item => statusMap[item._id] === 'pending');
    } else if (!['All', 'Applied', 'Pending'].includes(filter)) {
      items = items.filter(item => item.type?.toLowerCase() === filter.toLowerCase());
    }
    return items;
  };

  const getColor = (id) => {
    const status = statusMap[id];
    if (status === 'applied') return '#d1fae5';
    if (status === 'pending') return '#e5e7eb';
    return 'white';
  };

  const getUpcoming = () => {
    const now = new Date();
    return [...allOpportunities]
      .filter(item => new Date(item.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  };

  const filteredItems = getFiltered();
  const upcoming = getUpcoming();

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <h1 className="dashboard-title">Explore Opportunities</h1>

        <div className="dashboard-tabs">
          {['All', 'Applied', 'Pending', 'Job', 'Hackathon', 'College Event'].map(type => (
            <span
              key={type}
              onClick={() => setFilter(type)}
              className={`tab ${filter === type ? 'active' : ''}`}
            >
              {type}
            </span>
          ))}
        </div>

        <div className="opportunity-grid">
          {filteredItems.length === 0 ? (
            <p>No opportunities available.</p>
          ) : (
            filteredItems.map(item => (
              <div
                key={item._id}
                className="opportunity-card"
                style={{ backgroundColor: getColor(item._id) }}
              >
                <h3>{item.title}</h3>
                <p className="type">{item.type}</p>
                <p>{item.description}</p>
                <p className="deadline">
                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                </p>
                {item.link ? (
                  <>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-button"
                    >
                      Apply Now
                    </a>
                    <div className="status-buttons">
                      {(filter === 'All' || filter === 'Pending') && (
                        <button onClick={() => updateStatus(item._id, 'applied')}>
                          ✅ Applied
                        </button>
                      )}
                      {filter === 'All' && (
                        <button onClick={() => updateStatus(item._id, 'pending')}>
                          ⚪ Just Saw
                        </button>
                      )}
                    </div>
                  </>
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
