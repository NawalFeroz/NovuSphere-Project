import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye } from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
  }, []);

  useEffect(() => {
    if (!email || allOpportunities.length === 0) return;

    axios.get(`http://localhost:5000/status/${email}`)
      .then(res => {
        const serverStatus = res.data.status || {};
        const normalized = {};
        allOpportunities.forEach(item => {
          const status = serverStatus[item._id];
          if (['applied', 'pending', 'qualified', 'won', 'just saw'].includes(status)) {
            normalized[item._id] = status;
          }
        });
        setStatusMap(normalized);
      })
      .catch(err => console.error('Fetch status error:', err));
  }, [email, allOpportunities]);

const updateStatus = async (id, status) => {
  if (status === 'qualified' || status === 'won') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.png,.jpg,.jpeg';
    input.style.display = 'none';

    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('email', email);
      formData.append('jobId', id);
      formData.append('status', status);
      formData.append('certificate', file);

      try {
        await axios.post(`http://localhost:5000/upload-certificate`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const updated = { ...statusMap, [id]: status };
        setStatusMap(updated);

        await axios.post(`http://localhost:5000/status/${email}`, { status: updated });
      } catch (err) {
        console.error('Upload error:', err);
      }
    });

    // Append to body and trigger click
    document.body.appendChild(input);
    input.click();
    // Clean up after file is selected
    document.body.removeChild(input);
  } else {
    const updated = { ...statusMap, [id]: status };
    setStatusMap(updated);

    axios.post(`http://localhost:5000/status/${email}`, { status: updated })
      .then(() => console.log('Status saved'))
      .catch(err => console.error('Error saving status:', err));
  }
};


  const getFiltered = () => {
    return allOpportunities.filter(item => {
      const status = statusMap[item._id];
      switch (filter) {
        case 'Applied': return status === 'applied';
        case 'Pending': return status === 'pending' || status === 'just saw';
        case 'Qualified': return status === 'qualified';
        case 'Won': return status === 'won';
        case 'Job':
        case 'Hackathon':
        case 'College Event':
          return item.type?.toLowerCase() === filter.toLowerCase();
        case 'All':
        default: return true;
      }
    });
  };

  const getColor = (id) => {
    const status = statusMap[id];
    switch (status) {
      case 'applied': return '#fde047';
      case 'pending':
      case 'just saw': return '#e5e7eb';
      case 'qualified': return '#fed7aa';
      case 'won': return '#bbf7d0';
      default: return 'white';
    }
  };

  const getUpcoming = () => {
    const now = new Date();
    return allOpportunities
      .filter(item => new Date(item.deadline) > now)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  };

  const statusCounts = {
    applied: 0,
    pending: 0,
    qualified: 0,
    won: 0,
  };

  Object.values(statusMap).forEach(status => {
    if (status === 'applied') statusCounts.applied++;
    if (status === 'pending' || status === 'just saw') statusCounts.pending++;
    if (status === 'qualified') statusCounts.qualified++;
    if (status === 'won') statusCounts.won++;
  });

  const colors = {
    applied: '#fde047',
    pending: '#e5e7eb',
    qualified: '#fb923c',
    won: '#34d399',
  };

  const filteredItems = getFiltered();
  const upcoming = getUpcoming();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="status-stars">
            <div className="star-block">
              <span>Qualified:</span>
              {Array(statusCounts.qualified).fill().map((_, i) => <span key={i} className="silver-star">★</span>)}
            </div>
            <div className="star-block">
              <span>Won:</span>
              {Array(statusCounts.won).fill().map((_, i) => <span key={i} className="gold-star">★</span>)}
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>

        <h1 className="dashboard-title">Explore Opportunities</h1>

        <div className="dashboard-tabs">
          {['All', 'Applied', 'Pending', 'Qualified', 'Won', 'Job', 'Hackathon', 'College Event'].map(type => (
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
              <div key={item._id} className="opportunity-card" style={{ backgroundColor: getColor(item._id) }}>
                <div className="card-header">
                  <div className="status-actions">
                    <button onClick={() => updateStatus(item._id, 'applied')}>✅ Applied</button>
                    <button
                      onClick={() => updateStatus(item._id, 'pending')}
                      className="eye-button"
                      title="Mark as Just Saw"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <select
                    value={['qualified', 'won'].includes(statusMap[item._id]) ? statusMap[item._id] : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) updateStatus(item._id, val);
                    }}
                    className="status-dropdown"
                  >
                    <option value="">-- Status --</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Won</option>
                  </select>
                </div>

                <h3>{item.title}</h3>
                <p className="type">{item.type}</p>
                <p>{item.description}</p>
                <p className="deadline">
                  Deadline: {new Date(item.deadline).toLocaleDateString()}
                </p>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="apply-button">
                    Apply Now
                  </a>
                ) : (
                  <button disabled className="apply-button disabled">No Link Available</button>
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

        <div className="progress-summary">
          <h3>Application Progress</h3>
          {['applied', 'pending', 'qualified', 'won'].map(key => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            const count = statusCounts[key];
            const percent = ((count / allOpportunities.length || 1) * 100).toFixed(1);

            return (
              <div
                key={key}
                className="progress-bar-container clickable"
                onClick={() => setFilter(label)}
              >
                <div className="progress-label">{label} ({count})</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: colors[key] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="dashboard-footer">
        © {new Date().getFullYear()} Nawal Feroz , Srihitha Reddy , KVS Sahithi
      </footer>
    </div>
  );
};

export default StudentDashboard;
