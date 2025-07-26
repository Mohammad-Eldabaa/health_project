import React from 'react';
import { NavLink } from 'react-router-dom';
import NursingAppointmentList from './NursingAppointmentList';
import NursingSidebar from './NursingSidebar';
import NursingDashboardCharts from './NursingDashboardCharts';

const NursingDashboard = () => {
  return (
    <div className="w-full p-0" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <NursingSidebar />

        {/* Main Content */}
        <main className="flex-grow px-4 bg-cyan-100 min-h-screen">
          {/* Mobile Navbar */}
          <nav className="md:hidden flex items-center justify-between bg-white p-3 shadow">
            <button
              className="text-gray-700 focus:outline-none"
              type="button"
              aria-label="Toggle navigation"
              onClick={() => {
                const el = document.getElementById('sidebarMenu');
                if (el) el.classList.toggle('hidden');
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>

          {/* Header */}
          <div className="flex justify-between items-center pt-4 pb-3 mb-4 border-b border-gray-300 flex-wrap gap-2">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <i className="bi bi-speedometer2"></i>
              لوحة سكرتارية
            </h1>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-sm border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                <i className="bi bi-calendar-week mr-1"></i> اليوم
              </button>
              <button
                type="button"
                className="text-sm border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                <i className="bi bi-calendar-range mr-1"></i> الأسبوع
              </button>
            </div>
          </div>

          {/* Dashboard Charts */}
          <NursingDashboardCharts />
        </main>
      </div>
    </div>
  );
};

export default NursingDashboard;
