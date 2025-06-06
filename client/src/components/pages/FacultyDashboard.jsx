import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const FacultyDashboard = () => {
  const [postedEvents, setPostedEvents] = useState([]);
  const [view, setView] = useState('post');
  const [jobStats, setJobStats] = useState([]);

  useEffect(() => {
    if (view === 'view') fetchPostedEvents();
    if (view === 'stats') fetchJobStats();
  }, [view]);

  const fetchPostedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getjobs');
      setPostedEvents(response.data);
    } catch (error) {
      console.error('Error fetching posted events', error);
    }
  };

  const fetchJobStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/job-stats');
      setJobStats(response.data);
    } catch (error) {
      console.error('Error fetching job stats:', error);
    }
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const type = e.target.type.value;
    const description = e.target.description.value;
    const link = e.target.link.value;
    const deadline = e.target.deadline.value;

    const newEvent = { title, type, description, link, deadline };

    try {
      await axios.post('http://localhost:5000/postjob', newEvent);
      fetchPostedEvents();
    } catch (error) {
      console.error('Error posting new event', error);
    }

    e.target.reset();
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/deletejob/${jobId}`);
      fetchPostedEvents();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161b22] text-[#c9d1d9] p-6 border-r border-[#30363d]">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        {['post', 'view', 'stats'].map((item) => (
          <button
            key={item}
            onClick={() => setView(item)}
            className={`block w-full text-left px-4 py-2 mb-2 rounded border ${
              view === item
                ? 'bg-blue-600 text-white'
                : 'hover:bg-[#21262d] border-[#30363d]'
            }`}
          >
            {item === 'post'
              ? 'Post Job'
              : item === 'view'
              ? 'View Posted Jobs'
              : 'Application Stats'}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#58a6ff]">
          Faculty Dashboard
        </h1>

        {/* Post Job View */}
        {view === 'post' && (
          <form
            onSubmit={handlePostEvent}
            className="bg-[#161b22] border border-[#30363d] p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Post New Opportunity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                type="text"
                placeholder="Title"
                required
                className="p-2 bg-[#0d1117] text-white border border-[#30363d] rounded"
              />
              <select
                name="type"
                required
                className="p-2 bg-[#0d1117] text-white border border-[#30363d] rounded"
              >
                <option value="Job">Job</option>
                <option value="Hackathon">Hackathon</option>
                <option value="College Event">College Event</option>
              </select>
              <input
                name="description"
                type="text"
                placeholder="Description"
                required
                className="p-2 bg-[#0d1117] text-white border border-[#30363d] rounded"
              />
              <input
                name="link"
                type="url"
                placeholder="Link (e.g. https://example.com)"
                required
                className="p-2 bg-[#0d1117] text-white border border-[#30363d] rounded"
              />
              <input
                name="deadline"
                type="date"
                required
                className="p-2 bg-[#0d1117] text-white border border-[#30363d] rounded"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Post Opportunity
            </button>
          </form>
        )}

        {/* View Posted Jobs */}
        {view === 'view' && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Your Posted Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postedEvents.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg shadow-md relative"
                >
                  <h3 className="text-xl font-bold mb-1 text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#8b949e]">{event.type}</p>
                  <p className="text-sm text-[#c9d1d9] mb-2">
                    {event.description}
                  </p>
                  <p className="text-sm mb-2">
                    Link:{' '}
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {event.link}
                    </a>
                  </p>
                  <p className="text-sm text-[#8b949e]">
                    Deadline: {event.deadline}
                  </p>
                  <button
                    onClick={() => handleDeleteJob(event._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Application Stats View */}
        {view === 'stats' && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Application Statistics
            </h2>
            <div className="space-y-6">
              {jobStats.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-[#161b22] border border-[#30363d] p-4 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <p className="text-sm text-green-400 mt-2">
                    ✅ Applied: {job.applied.length}
                  </p>
                  <ul className="text-sm text-green-300 mb-2 list-disc pl-5">
                    {job.applied.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-red-400">
                    ❌ Not Applied: {job.notApplied.length}
                  </p>
                  <ul className="text-sm text-red-300 list-disc pl-5">
                    {job.notApplied.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
