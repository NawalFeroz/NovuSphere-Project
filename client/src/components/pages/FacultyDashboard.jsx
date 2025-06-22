import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const generateAllUsers = () => {
  const users = [];
  for (let i = 1201; i <= 1265; i++) {
    const numStr = i.toString().padStart(4, '0');
    users.push(`22wh1a${numStr}@gmail.com`);
  }
  return users;
};

const FacultyDashboard = () => {
  const [view, setView] = useState('stats');
  const [postedJobs, setPostedJobs] = useState([]);
  const [jobStats, setJobStats] = useState([]);
  const navigate = useNavigate();

  const fetchJobStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/job-stats');
      const allUsers = generateAllUsers();

      const enriched = response.data.map((job) => {
        const applied = job.appliedEmails ?? [];
        const qualified = job.qualifiedEmails ?? [];
        const won = job.wonEmails ?? [];
        const pending = allUsers.filter((email) => !applied.includes(email));
        return { ...job, applied, qualified, won, pending };
      });

      setJobStats(enriched);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getjobs');
      setPostedJobs(response.data);
    } catch (error) {
      console.error('Error fetching posted jobs:', error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newJob = {
      title: form.title.value,
      type: form.type.value,
      description: form.description.value,
      link: form.link.value,
      deadline: form.deadline.value,
    };
    try {
      await axios.post('http://localhost:5000/postjob', newJob);
      alert('Job posted successfully');
      form.reset();
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deletejob/${id}`);
      fetchPostedJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const downloadCSV = (data, filename) => {
    const csv = 'data:text/csv;charset=utf-8,' + data.join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (view === 'stats') fetchJobStats();
    if (view === 'view') fetchPostedJobs();
  }, [view]);

  return (
    <div className="flex min-h-screen text-white bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Faculty Panel</h2>
        <button onClick={() => setView('post')} className="block w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">📤 Post Job</button>
        <button onClick={() => setView('view')} className="block w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">📁 View Posted Jobs</button>
        <button onClick={() => setView('stats')} className="block w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">📊 Application Stats</button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* 🔴 Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            🚪 Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center text-cyan-400">Faculty Dashboard</h1>

        {view === 'post' && (
          <form onSubmit={handlePostJob} className="max-w-xl mx-auto space-y-4 bg-slate-800 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2 text-white">Post New Job</h2>
            <input name="title" placeholder="Job Title" required className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" />
            <select name="type" required className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white">
              <option value="Job">Job</option>
              <option value="Hackathon">Hackathon</option>
              <option value="College Event">College Event</option>
            </select>
            <input name="description" placeholder="Description" required className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" />
            <input name="link" type="url" placeholder="Link (https://...)" required className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" />
            <input name="deadline" type="date" required className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white" />
            <button type="submit" className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded">Post Job</button>
          </form>
        )}

        {view === 'view' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white text-center">📁 Your Posted Jobs</h2>
            {postedJobs.length === 0 ? (
              <p className="text-gray-400 text-center">No jobs have been posted yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="relative bg-slate-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
                  >
                    <div className="absolute top-2 right-2">
                      <button
                        title="Delete"
                        onClick={() => handleDelete(job._id)}
                        className="text-red-400 hover:text-red-300 text-lg"
                      >
                        🗑️
                      </button>
                    </div>

                    <h3 className="text-xl font-bold text-cyan-300 mb-1">{job.title}</h3>

                    <div className="flex flex-wrap gap-2 text-sm mb-3">
                      <span className="bg-indigo-600 text-white px-2 py-1 rounded-full">{job.type}</span>
                      <span className="bg-amber-600 text-white px-2 py-1 rounded-full">
                        Deadline: {job.deadline}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-2">{job.description}</p>

                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sky-400 hover:underline"
                    >
                      🔗 View Link
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'stats' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-white">Application Stats</h2>
            {jobStats.length === 0 ? (
              <p>No statistics available.</p>
            ) : (
              jobStats.map((job, index) => (
                <div key={index} className="bg-slate-800 p-4 rounded shadow">
                  <h3 className="text-lg font-bold text-white">{job.title}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                    <div>
                      <p className="text-green-400">✅ Applied: {job.applied.length}</p>
                      <button
                        onClick={() => downloadCSV(job.applied, `${job.title}-applied.csv`)}
                        className="text-xs mt-1 px-2 py-1 bg-green-700 hover:bg-green-800 rounded"
                      >
                        ⬇️
                      </button>
                    </div>
                    <div>
                      <p className="text-yellow-400">🏅 Qualified: {job.qualified.length}</p>
                      <button
                        onClick={() => downloadCSV(job.qualified, `${job.title}-qualified.csv`)}
                        className="text-xs mt-1 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded"
                      >
                        ⬇️
                      </button>
                    </div>
                    <div>
                      <p className="text-blue-400">🏆 Won: {job.won.length}</p>
                      <button
                        onClick={() => downloadCSV(job.won, `${job.title}-won.csv`)}
                        className="text-xs mt-1 px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded"
                      >
                        ⬇️
                      </button>
                    </div>
                    <div>
                      <p className="text-red-400">🕒 Pending: {job.pending.length}</p>
                      <button
                        onClick={() => downloadCSV(job.pending, `${job.title}-pending.csv`)}
                        className="text-xs mt-1 px-2 py-1 bg-red-700 hover:bg-red-800 rounded"
                      >
                        ⬇️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
