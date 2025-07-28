import React, { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import useAppointmentStore from '../../store/appointmentStore';
import NursingSidebar from './NursingSidebar';

const AppointmentItem = ({ appt, index, moveAppointment }) => {
  const { cancelAppointment } = useAppointmentStore();

  const [{ isDragging }, drag] = useDrag({
    type: 'APPOINTMENT',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'APPOINTMENT',
    hover: item => {
      if (item.index !== index) {
        moveAppointment(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <tr
      ref={node => drag(drop(node))}
      className={`transition-all duration-200 ${
        isDragging ? 'opacity-50 bg-gray-100 shadow-md' : 'opacity-100 hover:bg-gray-50'
      }`}
    >
      <td className="cursor-move py-4">
        <i className="bi bi-grip-vertical me-2 text-gray-400"></i>
        <span className="font-medium">{index + 1}</span>
      </td>
      <td className="py-4">
        <span className="font-medium text-gray-800">{appt.patientName}</span>
      </td>
      <td className="py-4">
        <span className="badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          <i className="bi bi-heart-pulse me-1"></i>
          {appt.doctor}
        </span>
      </td>
      <td className="py-4">
        <span className="badge bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
          <i className="bi bi-telephone me-1"></i>
          {appt.patientNumber}
        </span>
      </td>
      <td className="py-4">
        <span className="badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
          <i className="bi bi-geo-alt me-1"></i>
          {appt.patientAddress}
        </span>
      </td>
      <td className="py-4">
        <span className="text-gray-700">{new Date(appt.date).toLocaleDateString('ar-EG')}</span>
      </td>
      <td className="py-4">
        <span className="text-gray-700">{appt.time}</span>
      </td>
      <td className="py-4">{appt.notes || <span className="text-gray-400 italic">لا توجد ملاحظات</span>}</td>
      <td className="py-4">
        <button
          onClick={() => cancelAppointment(appt.id)}
          className="btn btn-sm btn-outline-danger hover:bg-red-50 transition-colors duration-200"
        >
          <i className="bi bi-x-circle me-1"></i>
          إلغاء
        </button>
      </td>
    </tr>
  );
};

const NursingAppointments = () => {
  const { appointments, addAppointment, reorderAppointments, fetchAppointments, error } = useAppointmentStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientNumber: '',
    patientAddress: '',
    doctor: '',
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    addAppointment(formData);
    setFormData({
      patientName: '',
      patientNumber: '',
      patientAddress: '',
      doctor: '',
      date: '',
      time: '',
      notes: '',
    });
    setShowModal(false);
  };

  const moveAppointment = (fromIndex, toIndex) => {
    reorderAppointments(fromIndex, toIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="flex flex-col md:flex-row">
          <NursingSidebar />
          <main className="flex-1 p-4 md:p-6">
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

            <div className="bg-white shadow-lg rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h5 className="text-xl font-bold flex items-center text-cyan-800">
                  <i className="bi bi-calendar-check ml-2"></i>
                  المواعيد المجدولة
                </h5>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-red-700 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-cyan-800 transition duration-300 flex items-center"
                >
                  <i className="bi bi-calendar-plus ml-2"></i>
                  إضافة موعد
                </button>
              </div>

              {error && (
                <div
                  className="alert alert-danger bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 mb-4"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}

              {appointments.length === 0 && !error ? (
                <div
                  className="alert alert-info bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100"
                  role="alert"
                >
                  <i className="bi bi-info-circle me-2"></i>
                  لا توجد مواعيد مجدولة بعد.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          الرقم
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          المريض
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          نوع الكشف
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          الهاتف
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          العنوان
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          التاريخ
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          العمر
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          الملاحظات
                        </th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold text-gray-700">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {appointments.map((appt, index) => (
                        <AppointmentItem key={appt.id} appt={appt} index={index} moveAppointment={moveAppointment} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h5 className="text-xl font-bold text-green-800">إضافة موعد</h5>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                      <i className="bi bi-x-lg text-lg"></i>
                    </button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="patientName" className="block text-sm font-semibold text-gray-700 mb-2">
                          اسم المريض
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="patientName"
                          name="patientName"
                          value={formData.patientName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="patientNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="patientNumber"
                          name="patientNumber"
                          value={formData.patientNumber}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="patientAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                          عنوان المريض
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="patientAddress"
                          name="patientAddress"
                          value={formData.patientAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="doctor" className="block text-sm font-semibold text-gray-700 mb-2">
                          نوع الكشف
                        </label>
                        <select
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
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
                      </div>
                      <div>
                        <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                          التاريخ
                        </label>
                        <input
                          type="date"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                          العمر
                        </label>
                        <input
                          type="number"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="time"
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          required
                          min="0"
                        />
                      </div>
                      <div>
                        <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                          ملاحظات
                        </label>
                        <textarea
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-colors duration-200"
                          id="notes"
                          name="notes"
                          rows="4"
                          value={formData.notes}
                          onChange={handleChange}
                          placeholder="أضف أي ملاحظات إضافية..."
                        ></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-700 text-green-600 rounded-lg hover:bg-cyan-800 transition duration-300"
                        >
                          إضافة الموعد
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </DndProvider>
  );
};

export default NursingAppointments;
