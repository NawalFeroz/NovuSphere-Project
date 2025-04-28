// client/components/pages/FacultyDashboard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FacultyDashboard = () => {
  const [postedEvents, setPostedEvents] = useState([]);

  const handlePostEvent = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const type = e.target.type.value;
    const description = e.target.description.value;
    const deadline = e.target.deadline.value;

    const newEvent = { title, type, description, deadline };
    setPostedEvents([...postedEvents, newEvent]);
    e.target.reset();
  };

  const handleDeleteEvent = (index) => {
    const updated = postedEvents.filter((_, idx) => idx !== index);
    setPostedEvents(updated);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-center">Faculty Dashboard</h1>

      {/* Post Opportunity */}
      <form onSubmit={handlePostEvent} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Post New Opportunity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" type="text" placeholder="Title" required className="input" />
          <input name="type" type="text" placeholder="Type (Hackathon, Job...)" required className="input" />
          <input name="description" type="text" placeholder="Short Description" required className="input" />
          <input name="deadline" type="date" required className="input" />
        </div>
        <button type="submit" className="btn mt-4">Post Opportunity</button>
      </form>

      {/* Posted Events */}
      <h2 className="text-2xl font-semibold mb-4">Your Posted Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {postedEvents.map((event, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md relative"
          >
            <button
              onClick={() => handleDeleteEvent(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="mb-1">{event.description}</p>
            <p className="text-sm text-gray-600">{event.type} — Deadline: {event.deadline}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDashboard;
