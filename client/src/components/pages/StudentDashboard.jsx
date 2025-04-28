import React from 'react';

function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Student 👋</h1>
        <p className="text-gray-600 mt-1">Here’s your dashboard overview</p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">

          {/* Opportunities Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Example Opportunity Cards */}
              {[
                { title: "Hackathon XYZ", status: "Applied but not started", color: "bg-blue-100", link: "#" },
                { title: "Internship ABC", status: "Applied and started", color: "bg-orange-100", link: "#" },
                { title: "Job PQR", status: "Applied, finished, and won", color: "bg-green-100", link: "#" },
                { title: "Event LMN", status: "Applied, finished but not won", color: "bg-gray-300", link: "#" },
              ].map((item, index) => (
                <div key={index} className={`p-4 rounded-lg shadow-md ${item.color}`}>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-700 mt-2">{item.status}</p>
                  <a href={item.link} className="text-blue-500 hover:underline text-sm mt-2 inline-block">View Details</a>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Deadlines */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {/* Example Reminders */}
              <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <span>Hackathon XYZ - 2 days left</span>
                <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">Apply</button>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                <span>Internship ABC - 5 days left</span>
                <button className="text-sm bg-green-500 text-white px-3 py-1 rounded">Submit</button>
              </div>
            </div>
          </section>

        </div>

        {/* Right Side */}
        <div className="space-y-6">

          {/* Application Status Board */}
          <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Application Status</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-500">5</p>
                <p className="text-gray-600 text-sm">In Progress</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">3</p>
                <p className="text-gray-600 text-sm">Accepted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">2</p>
                <p className="text-gray-600 text-sm">Rejected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-700">10</p>
                <p className="text-gray-600 text-sm">Total Applied</p>
              </div>
            </div>
          </section>

          {/* Profile Preview */}
          <section className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Profile</h2>
            <div className="flex flex-col items-center space-y-3">
              <img src="https://via.placeholder.com/80" alt="Profile" className="w-20 h-20 rounded-full" />
              <p className="font-semibold text-lg">Student Name</p>
              <p className="text-gray-500 text-sm">student@example.com</p>
              <button className="text-sm mt-2 bg-indigo-500 text-white px-4 py-2 rounded">Edit Profile</button>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}

export default StudentDashboard;
