import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const NursingDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientName: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prev) => [...prev, { ...formData, id: Date.now() }]);
    setFormData({ patientName: "", doctor: "", date: "", time: "", notes: "" });
  };

  const handleCancel = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  return (
    <div className="container-fluid min-vh-100 p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 d-md-block text-white sidebar collapse" style={{backgroundColor: '#0097A7'}}>
          <div className="position-sticky pt-3">
            <h2 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white px-3">
              <i className="bi bi-hospital me-2"></i>
              <span className="fs-4">Nursing Panel</span>
            </h2>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <a href="#" className="nav-link active" aria-current="page">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Add Appointment
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-calendar-week me-2"></i>
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-people me-2"></i>
                  Patients
                </a>
              </li>
              <li>
                <a href="#" className="nav-link text-white">
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 ms-sm-auto px-md-4" style={{backgroundColor: '#B2EBF2'}}>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">
              <i className="bi bi-speedometer2 me-2"></i>
              Secretary Dashboard
            </h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group me-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-week me-1"></i>Today
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                >
                  <i className="bi bi-calendar-range me-1"></i>Week
                </button>
              </div>
            </div>
          </div>

          {/* Add Appointment Form */}
          <div className="card mb-4">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                Add Appointment
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="patientName" className="form-label">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientName"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="doctor" className="form-label">
                      Doctor
                    </label>
                    <select
                      className="form-select"
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Doctor</option>
                      <option value="Dr. Smith">Dr. Smith</option>
                      <option value="Dr. Johnson">Dr. Johnson</option>
                      <option value="Dr. Williams">Dr. Williams</option>
                      <option value="Dr. Brown">Dr. Brown</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="time" className="form-label">
                      Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn" style={{backgroundColor: '#0097A7'}}>
                      <i className="bi bi-save me-1"></i>
                      Add Appointment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Appointments List */}
          <div className="card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Scheduled Appointments
              </h5>
            </div>
            <div className="card-body">
              {appointments.length === 0 ? (
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  No appointments scheduled yet.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Patient</th>
                        <th scope="col">Doctor</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td>
                            <i className="bi bi-person-circle me-2"></i>
                            {appt.patientName}
                          </td>
                          <td>
                            <span className="badge bg-info text-dark">
                              <i className="bi bi-activity me-1"></i>
                              {appt.doctor}
                            </span>
                          </td>
                          <td>{new Date(appt.date).toLocaleDateString()}</td>
                          <td>{appt.time}</td>
                          <td>
                            {appt.notes || (
                              <span className="text-muted">No notes</span>
                            )}
                          </td>
                          <td>
                            <button
                              onClick={() => handleCancel(appt.id)}
                              className="btn btn-sm btn-outline-danger"
                            >
                              <i className="bi bi-x-circle me-1"></i>
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NursingDashboard;
