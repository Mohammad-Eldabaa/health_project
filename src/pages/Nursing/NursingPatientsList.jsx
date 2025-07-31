import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '../../supaBase/booking';
import { Schema } from '../bookingPage/schema';
import * as Yup from 'yup';
import NursingSidebar from './NursingSidebar';
import { Edit, Delete } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const NursingPatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phoneNumber: '',
    address: '',
    bookingDate: '',
    visitType: '',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('id, fullName, age, phoneNumber, address, bookingDate, visitType, notes')
          .order('id', { ascending: true });

        if (error) {
          console.error('Error fetching patients:', error.message, error.details);
          setError(`فشل في جلب المرضى: ${error.message}`);
          return;
        }

        setPatients(data || []);
        setError(null);
      } catch (err) {
        console.error('Unexpected error fetching patients:', err);
        setError('حدث خطأ غير متوقع أثناء جلب المرضى.');
      }
    };

    fetchPatients();
  }, []);

  // Handle form input changes
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Open edit modal with patient data
  const openEditModal = patient => {
    setCurrentPatient(patient);
    setFormData({
      fullName: patient.fullName,
      age: patient.age.toString(),
      phoneNumber: patient.phoneNumber,
      address: patient.address,
      bookingDate: patient.bookingDate,
      visitType: patient.visitType,
      notes: patient.notes || '',
    });
    setShowEditModal(true);
  };

  // Update patient in Supabase
  const updatePatient = async () => {
    try {
      const editSchema = Schema.omit(['amount']); // Exclude amount for editing
      await editSchema.validate(formData, { abortEarly: false });

      const updatedPatient = {
        fullName: formData.fullName,
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bookingDate: formData.bookingDate,
        visitType: formData.visitType,
        notes: formData.notes || null,
      };

      const { error } = await supabase.from('patients').update(updatedPatient).eq('id', currentPatient.id);

      if (error) {
        console.error('Error updating patient:', error.message, error.details);
        alert(`فشل في تحديث المريض: ${error.message}`);
        return;
      }

      // Update local state
      setPatients(prev => prev.map(p => (p.id === currentPatient.id ? { ...p, ...updatedPatient } : p)));
      setShowEditModal(false);
      setFormErrors({});
      alert('تم تحديث بيانات المريض بنجاح!');
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Unexpected error updating patient:', err);
        alert('حدث خطأ غير متوقع أثناء تحديث المريض.');
      }
    }
  };

  // Delete patient from Supabase
  const deletePatient = async id => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المريض؟ سيتم حذف جميع المواعيد المرتبطة بهذا المريض.')) return;

    try {
      // Step 1: Delete all appointments associated with the patient
      const { error: appointmentError } = await supabase.from('appointments').delete().eq('patient_id', id);

      if (appointmentError) {
        console.error('Error deleting associated appointments:', appointmentError.message, appointmentError.details);
        alert(`فشل في حذف المواعيد المرتبطة: ${appointmentError.message}`);
        return;
      }

      // Step 2: Delete the patient
      const { error: patientError } = await supabase.from('patients').delete().eq('id', id);

      if (patientError) {
        console.error('Error deleting patient:', patientError.message, patientError.details);
        alert(`فشل في حذف المريض: ${patientError.message}`);
        return;
      }

      // Update local state
      setPatients(prev => prev.filter(p => p.id !== id));
      alert('تم حذف المريض وجميع مواعيده بنجاح!');
    } catch (err) {
      console.error('Unexpected error deleting patient:', err);
      alert('حدث خطأ غير متوقع أثناء حذف المريض.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50" dir="rtl">
      <Helmet>
        <title>إدارة المرضى - نظام المواعيد الطبية</title>
        <meta
          name="description"
          content="إدارة بيانات المرضى بسهولة وفعالية. عرض، تعديل، وحذف سجلات المرضى مع دعم كامل للغة العربية."
        />
        <meta name="keywords" content="إدارة المرضى, مواعيد طبية, نظام عيادة, سجلات المرضى, برمجيات طبية" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="نظام إدارة العيادات" />
        <meta property="og:title" content="إدارة المرضى - نظام المواعيد الطبية" />
        <meta
          property="og:description"
          content="نظام متقدم لإدارة بيانات المرضى، يتيح عرض وتعديل وحذف سجلات المرضى بسهولة."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="إدارة المرضى - نظام المواعيد الطبية" />
        <meta name="twitter:description" content="إدارة بيانات المرضى بسهولة وفعالية مع نظام المواعيد الطبية." />
      </Helmet>

      {/* Sidebar */}
      <NursingSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6">
        <nav className="bg-white p-3 rounded-lg shadow-sm md:hidden mb-4">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-4 md:p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-800 text-right">المرضى</h2>
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-cyan-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 mb-4 flex items-center shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </motion.div>
          )}

          {patients.length === 0 && !error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 flex items-center shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              لا توجد بيانات مرضى بعد.
            </motion.div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">رقم</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">الإسم</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">العمر</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">رقم الهاتف</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">العنوان</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">تاريخ الحجز</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">نوع الزيارة</th>
                      <th className="px-6 py-4 text-right font-semibold text-cyan-800">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {patients.map((patient, index) => (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01, backgroundColor: 'rgba(236, 253, 245, 0.5)' }}
                        className="hover:bg-teal-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-right font-medium text-gray-700">{patient.id}</td>
                        <td className="px-6 py-4 text-right font-medium text-gray-800">{patient.fullName}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{patient.age}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{patient.phoneNumber}</td>
                        <td className="px-6 py-4 text-right text-gray-700">{patient.address}</td>
                        <td className="px-6 py-4 text-right text-gray-700">
                          {new Date(patient.bookingDate).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              patient.visitType === 'فحص'
                                ? 'bg-purple-100 text-purple-800'
                                : patient.visitType === 'متابعة'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {patient.visitType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                            onClick={() => alert(`عرض تفاصيل المريض ${patient.fullName}`)}
                          >
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-orange-600 hover:bg-orange-50 transition-colors"
                            onClick={() => openEditModal(patient)}
                          >
                            <Edit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => deletePatient(patient.id)}
                          >
                            <Delete />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden flex flex-col gap-4">
                {patients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-600">#{patient.id}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          patient.visitType === 'فحص'
                            ? 'bg-purple-100 text-purple-800'
                            : patient.visitType === 'متابعة'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {patient.visitType}
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">الاسم:</span>
                        <span className="text-gray-800 font-medium">{patient.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">العمر:</span>
                        <span className="text-gray-800">{patient.age}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">رقم الهاتف:</span>
                        <span className="text-gray-800 dir-ltr text-left">{patient.phoneNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">العنوان:</span>
                        <span className="text-gray-800">{patient.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">تاريخ الحجز:</span>
                        <span className="text-gray-800">
                          {new Date(patient.bookingDate).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-around pt-3 border-t border-gray-200">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => alert(`عرض تفاصيل المريض ${patient.fullName}`)}
                      >
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full text-orange-600 hover:bg-orange-50 transition-colors"
                        onClick={() => openEditModal(patient)}
                      >
                        <Edit />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => deletePatient(patient.id)}
                      >
                        <Delete />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Edit Patient Modal */}
        <AnimatePresence>
          {showEditModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
              >
                <div className="flex justify-between items-center mb-6">
                  <h5 className="text-xl font-bold text-cyan-800">تعديل بيانات المريض</h5>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setFormErrors({});
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    updatePatient();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        اسم المريض
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border ${
                          formErrors.fullName ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.fullName && <p className="text-red-600 text-sm mt-1">{formErrors.fullName}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                        العمر
                      </label>
                      <input
                        type="number"
                        className={`w-full p-3 border ${
                          formErrors.age ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.age && <p className="text-red-600 text-sm mt-1">{formErrors.age}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        className={`w-full p-3 border ${
                          formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.phoneNumber && <p className="text-red-600 text-sm mt-1">{formErrors.phoneNumber}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                        العنوان
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border ${
                          formErrors.address ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.address && <p className="text-red-600 text-sm mt-1">{formErrors.address}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="bookingDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        تاريخ الحجز
                      </label>
                      <input
                        type="date"
                        className={`w-full p-3 border ${
                          formErrors.bookingDate ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="bookingDate"
                        name="bookingDate"
                        value={formData.bookingDate}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.bookingDate && <p className="text-red-600 text-sm mt-1">{formErrors.bookingDate}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <label htmlFor="visitType" className="block text-sm font-semibold text-gray-700 mb-2">
                        نوع الزيارة
                      </label>
                      <select
                        className={`w-full p-3 border ${
                          formErrors.visitType ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="visitType"
                        name="visitType"
                        value={formData.visitType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">اختر نوع الزيارة</option>
                        <option value="فحص">فحص</option>
                        <option value="متابعة">متابعة</option>
                        <option value="استشارة">استشارة</option>
                      </select>
                      {formErrors.visitType && <p className="text-red-600 text-sm mt-1">{formErrors.visitType}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        الملاحظات
                      </label>
                      <textarea
                        className={`w-full p-3 border ${
                          formErrors.notes ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                        id="notes"
                        name="notes"
                        rows="4"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="أضف ملاحظات (اختياري)..."
                      ></textarea>
                      {formErrors.notes && <p className="text-red-600 text-sm mt-1">{formErrors.notes}</p>}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                      className="flex justify-end gap-3 pt-4"
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setFormErrors({});
                        }}
                        className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow-sm"
                      >
                        إلغاء
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 shadow-md"
                      >
                        حفظ التعديلات
                      </motion.button>
                    </motion.div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default NursingPatientsList;
