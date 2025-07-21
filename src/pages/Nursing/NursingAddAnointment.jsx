import React, { useState, useContext } from "react";
import { AppointmentContext } from "./AppointmentContext";
import NursingSidebar from "./NursingSidebar";

const NursingAddAnointment = () => {
  const { addAppointment } = useContext(AppointmentContext);
  const [formData, setFormData] = useState({
    patientName: "",
    patientNumber: "",
    patientAddress: "",
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
    addAppointment({ ...formData, id: Date.now() });
    setFormData({
      patientName: "",
      patientNumber: "",
      patientAddress: "",
      doctor: "",
      date: "",
      time: "",
      notes: "",
    });
  };

  return (
    <div className="container-fluid min-vh-100 p-0" dir="rtl">
      <div className="row g-0">
        {/* Sidebar */}
        <NursingSidebar />

        {/* Main Content */}
        <main
          className="col-md-9 col-lg-10 ms-sm-auto px-md-4 py-4"
          style={{ backgroundColor: "#B2EBF2" }}
        >
          {/* Mobile Navbar Toggle */}
          <nav className="navbar navbar-expand-md navbar-light bg-light d-md-none mb-3">
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

          {/* Form Card */}
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                إضافة موعد
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="patientName" className="form-label fw-bold">
                      اسم المريض
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
                    <label
                      htmlFor="patientNumber"
                      className="form-label fw-bold"
                    >
                      رقم الهاتف
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="patientNumber"
                      name="patientNumber"
                      value={formData.patientNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="doctor" className="form-label fw-bold">
                      نوع الكشف
                    </label>
                    <select
                      className="form-select"
                      id="doctor"
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">اختر نوع الكشف</option>
                      <option value="إستشارة">إستشارة</option>
                      <option value="إعادة كشف">إعادة</option>
                      <option value="كشف عادي">كشف</option>
                      <option value="طوارئ">طوارئ</option>
                    </select>
                    <label htmlFor="patientAddress" className="form-label fw-bold">
                      عنوان المريض
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="patientAddress"
                      name="patientAddress"
                      value={formData.patientAddress}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label fw-bold">
                      التاريخ
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
                    <label htmlFor="time" className="form-label fw-bold">
                      العمر
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label htmlFor="notes" className="form-label fw-bold">
                      ملاحظات
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="أضف أي ملاحظات إضافية..."
                    ></textarea>
                  </div>

                  <div className="col-12 text-end">
                    <button
                      type="submit"
                      className="btn text-white px-4"
                      style={{
                        backgroundColor: "#0097A7",
                        borderRadius: "0.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      <i className="bi bi-save me-2"></i>
                      إضافة الموعد
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NursingAddAnointment;
