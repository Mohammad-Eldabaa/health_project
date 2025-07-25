import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import NursingAppointmentList from "./NursingAppointmentList";
import NursingSidebar from "./NursingSidebar";
import NursingDashboardCharts from "./NursingDashboardCharts";

const NursingDashboard = () => {
  return (
    <div className="container-fluid p-0" dir="rtl">
      <div className="d-flex">
        {/* Sidebar */}
        <NursingSidebar />

        {/* Main Content */}
        <main
          className="flex-grow-1 px-md-4"
          style={{ backgroundColor: "#B2EBF2" }}
        >
          <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </nav>

          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              <i className="bi bi-speedometer2 me-2"></i>
              لوحة سكرتارية
            </h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-week me-1"></i>اليوم
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-range me-1"></i>الأسبوع
                </button>
              </div>
            </div>
          </div>

          <NursingDashboardCharts />
        </main>
      </div>
    </div>
  );
};

export default NursingDashboard;
