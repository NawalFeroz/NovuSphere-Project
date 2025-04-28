import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch jobs when the component mounts
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getjobs');  // Ensure the correct URL
        setJobs(response.data);  // Set the fetched jobs into state
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setError('Failed to fetch jobs. Please try again later.');
      }
    };
    fetchJobs();
  }, []);  // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Student 👋</h1>
        <p className="text-gray-600 mt-1">Here’s your dashboard overview</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {error ? (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              ) : (
                jobs.map((job, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-gray-700 mt-2">{job.description}</p>
                    <p className="text-gray-600 text-sm mt-2">Type: {job.type}</p>
                    <p className="text-gray-600 text-sm">Deadline: {job.deadline}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
