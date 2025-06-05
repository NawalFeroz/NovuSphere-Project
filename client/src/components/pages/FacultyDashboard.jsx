import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const FacultyDashboard = () => {
  const [postedEvents, setPostedEvents] = useState([]);
  const [view, setView] = useState('post');

  useEffect(() => {
    fetchPostedEvents();
  }, []);

  const fetchPostedEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getjobs');
      setPostedEvents(response.data);
    } catch (error) {
      console.error('Error fetching posted events', error);
    }
  };

  const handlePostEvent = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const type = e.target.type.value;
    const description = e.target.description.value;
    const link = e.target.link.value;         // NEW
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
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 text-black p-6 border-r border-gray-300">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <button
          onClick={() => setView('post')}
          className={`block w-full text-left px-4 py-2 mb-2 rounded border ${
            view === 'post' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          Post Job
        </button>
        <button
          onClick={() => setView('view')}
          className={`block w-full text-left px-4 py-2 rounded border ${
            view === 'view' ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
          }`}
        >
          View Posted Jobs
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Faculty Dashboard</h1>

        {view === 'post' && (
          <form
            onSubmit={handlePostEvent}
            className="bg-white border border-gray-300 p-6 rounded-lg shadow-md mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4">Post New Opportunity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                type="text"
                placeholder="Title"
                required
                className="p-2 border rounded"
              />
              <select name="type" required className="p-2 border rounded">
                <option value="Job">Job</option>
                <option value="Hackathon">Hackathon</option>
                <option value="College Event">College Event</option>
              </select>
              <input
                name="description"
                type="text"
                placeholder="Description"
                required
                className="p-2 border rounded"
              />
              <input
                name="link"                    // NEW INPUT FIELD
                type="url"
                placeholder="Link (e.g. https://example.com)"
                required
                className="p-2 border rounded"
              />
              <input
                name="deadline"
                type="date"
                required
                className="p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post Opportunity
            </button>
          </form>
        )}

        {view === 'view' && (
          <>
            <h2 className="text-2xl font-semibold mb-4">Your Posted Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postedEvents.map((event) => (
                <motion.div
                  key={event._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white border border-gray-300 p-4 rounded-lg shadow-md relative"
                >
                  <h3 className="text-xl font-bold mb-1">{event.title}</h3>
                  <p className="text-sm">{event.type}</p>
                  <p className="text-sm mb-2">{event.description}</p>
                  <p className="text-sm mb-2">
                    Link: <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{event.link}</a>
                  </p>
                  <p className="text-sm">Deadline: {event.deadline}</p>
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
      </main>
    </div>
  );
};

export default FacultyDashboard;
