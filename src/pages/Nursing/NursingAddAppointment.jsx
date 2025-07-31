import React, { useState, useContext } from "react";
import { AppointmentContext } from "./AppointmentContext";
import NursingSidebar from "./NursingSidebar";

const NursingAddAppointment = () => {
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex flex-row">
        {/* Sidebar */}
        <NursingSidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Mobile Navbar Toggle */}
          <nav className="bg-white p-3 md:hidden mb-4 rounded-lg shadow-sm">
            <button
              className="text-gray-700"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="inline-block w-6 h-6 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 30 30%27%3E%3Cpath stroke=%27rgba(0, 0, 0, 0.5)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-miterlimit=%2710%27 d=%27M4 7h22M4 15h22M4 23h22%27/%3E%3C/svg%3E')] bg-no-repeat bg-center" />
            </button>
          </nav>

          {/* Form Card */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="mb-4">
              <h5 className="text-xl font-bold flex items-center text-cyan-800">
                <i
                  className="bi bi father's day holiday essay in english
calendar-plus ml-2"
                ></i>
                إضافة موعد
              </h5>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="patientName"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    اسم المريض
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="patientNumber"
                    className="block text-sm font-semibold text-gray-700 mb-1 mt-4"
                  >
                    رقم الهاتف
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="patientNumber"
                    name="patientNumber"
                    value={formData.patientNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="doctor"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    نوع الكشف
                  </label>
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  <label
                    htmlFor="patientAddress"
                    className="block text-sm font-semibold text-gray-700 mb-1 mt-4"
                  >
                    عنوان المريض
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="patientAddress"
                    name="patientAddress"
                    value={formData.patientAddress}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    التاريخ
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    العمر
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label
                    htmlFor="notes"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    ملاحظات
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    id="notes"
                    name="notes"
                    rows="4"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="أضف أي ملاحظات إضافية..."
                  ></textarea>
                </div>

                <div className="col-span-1 md:col-span-2 text-left">
                  <button
                    type="submit"
                    className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-800 transition duration-300"
                  >
                    <i className="bi bi-save ml-2"></i>
                    إضافة الموعد
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NursingAddAppointment;
