import React, { useState, useEffect, useRef, memo } from 'react';
import { Helmet } from 'react-helmet';
import { useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import useAppointmentStore from '../../store/appointmentStore';
import { supabase } from '../../supaBase/NursingBooking';
import { Schema } from './nursingBookingSchema';
import NursingSidebar from './NursingSidebar';
import axios from 'axios';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { Payment, Delete, Add, Close, Visibility, Search } from '@mui/icons-material';
import Chart from 'chart.js/auto';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';

// Simple Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-100">
          <h6 className="font-semibold">حدث خطأ</h6>
          <p>فشل في عرض تفاصيل الموعد. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const AppointmentItem = memo(({ appt, index, moveAppointment }) => {
  const { deleteAppointment, updateAppointment } = useAppointmentStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    appointmentDateTime: appt.date && appt.time ? `${appt.date}T${appt.time}` : '',
    status: appt.status || 'في الإنتظار',
    reason: appt.reason || '',
    amount: appt.amount || null,
    doctor_id: appt.doctor_id || '',
  });
  const [doctors, setDoctors] = useState([]);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (!error) setDoctors(data || []);
    };
    fetchDoctors();
  }, []);

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

  const handlePayment = async paymentGateway => {
    try {
      const endpoint =
        paymentGateway === 'stripe' ? '/api/user/pay-appointment-stripe' : '/api/user/pay-appointment-paymob';

      const response = await axios.post(
        endpoint,
        { appointmentId: appt.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            origin: window.location.origin,
          },
        }
      );

      if (response.data.success) {
        window.location.href = response.data.url;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'فشل في بدء الدفع',
          text: response.data.message,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      Swal.fire({
        icon: 'error',
        title: 'خطأ في الدفع',
        text: 'حدث خطأ أثناء بدء الدفع. حاول مرة أخرى أو اتصل بالدعم.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
    setShowPaymentModal(false);
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      const [date, time] = editFormData.appointmentDateTime.split('T');
      const updatedData = {
        date,
        time,
        status: editFormData.status,
        reason: editFormData.reason || null,
        amount: editFormData.amount ? parseFloat(editFormData.amount) : null,
        doctor_id: editFormData.doctor_id || null,
      };
      await updateAppointment(appt.id, updatedData);
      setIsEditing(false);
      setIsExpanded(false);
      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      console.error('Error updating appointment:', err);
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'حدث خطأ أثناء تحديث الموعد.',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'doctor_id' && {
        amount: doctors.find(d => String(d.id) === value)?.fees || null,
      }),
    }));
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'تأكيد الحذف',
      text: 'هل أنت متأكد من حذف هذا الموعد؟',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'نعم، احذف',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });
    if (result.isConfirmed) {
      await deleteAppointment(appt.id);
      Swal.fire({
        icon: 'success',
        title: 'تم الحذف',
        text: 'تم حذف الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <>
      <motion.tr
        ref={node => drag(drop(node))}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{
          scale: 1.01,
          backgroundColor: 'rgba(236, 253, 245, 0.5)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
        className={`transition-all duration-200 ${
          isDragging ? 'opacity-50 bg-gray-100 shadow-lg' : 'opacity-100 hover:bg-gray-50'
        }`}
      >
        {!isMobile && (
          <td className="cursor-move py-4">
            <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }} className="inline-block">
              <i className="bi bi-grip-vertical me-2 text-gray-400"></i>
            </motion.div>
            <span className="font-medium bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-sm">{index + 1}</span>
          </td>
        )}
        <td className="py-4">
          <motion.div whileHover={{ x: -3 }} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-800 font-medium text-sm">{appt.patientName?.charAt(0) || 'N/A'}</span>
            </div>
            <span className="font-medium text-gray-800">{appt.patientName || 'غير متوفر'}</span>
          </motion.div>
        </td>
        {!isMobile && (
          <td className="py-4">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="badge bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1"
            >
              <i className="bi bi-heart-pulse text-blue-500"></i>
              {appt.doctorName || 'غير محدد'}
            </motion.span>
          </td>
        )}
        <td className="py-4">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`badge px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1 ${
              appt.status === 'في الإنتظار'
                ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800'
                : appt.status === 'ملغى'
                ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
                : 'bg-gradient-to-br from-green-50 to-green-100 text-green-800'
            }`}
          >
            <i
              className={`bi bi-${
                appt.status === 'في الإنتظار' ? 'clock' : appt.status === 'ملغى' ? 'x-circle' : 'check-circle'
              }`}
            ></i>
            {appt.status || 'غير محدد'}
          </motion.span>
        </td>
        {!isMobile && (
          <td className="py-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'غير متوفر'}
              </span>
            </motion.div>
          </td>
        )}
        {!isMobile && (
          <td className="py-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <span className="text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
                {appt.time || 'غير متوفر'}
              </span>
            </motion.div>
          </td>
        )}
        {!isMobile && (
          <td className="py-4">{appt.reason || <span className="text-gray-400 italic">لا توجد ملاحظات</span>}</td>
        )}
        <td className="py-4">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`badge px-3 py-1 rounded-full text-sm shadow-sm flex items-center gap-1 ${
              appt.payment
                ? 'bg-gradient-to-br from-green-50 to-green-100 text-green-800'
                : 'bg-gradient-to-br from-red-50 to-red-100 text-red-800'
            }`}
          >
            <i className={`bi bi-${appt.payment ? 'check-circle' : 'x-circle'}`}></i>
            {appt.payment ? 'مدفوع' : 'غير مدفوع'}
          </motion.span>
        </td>
        <td className="py-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Visibility fontSize="small" />
            </motion.button>
            {!appt.payment && (
              <>
                {!isMobile && (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentModal(true)}
                    className="btn btn-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm flex items-center gap-1"
                  >
                    <Payment fontSize="small" />
                    دفع أونلاين
                  </motion.button>
                )}
              </>
            )}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="btn btn-sm bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm flex items-center gap-1"
            >
              <Delete fontSize="small" />
              {isMobile ? '' : 'حذف'}
            </motion.button>
          </div>
        </td>
      </motion.tr>

      <AnimatePresence>
        {isExpanded && (
          <motion.tr
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <td colSpan={isMobile ? 4 : 9} className="p-4 bg-gray-50">
              <ErrorBoundary>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">التاريخ والوقت</label>
                      <input
                        type="datetime-local"
                        name="appointmentDateTime"
                        value={editFormData.appointmentDateTime}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الطبيب</label>
                      <select
                        name="doctor_id"
                        value={editFormData.doctor_id}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="">اختر الطبيب</option>
                        {doctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} (رسوم: {doctor.fees} جنيه)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الحالة</label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        required
                      >
                        <option value="في الإنتظار">في الإنتظار</option>
                        <option value="ملغى">ملغى</option>
                        <option value="تم">تم</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">الملاحظات</label>
                      <textarea
                        name="reason"
                        value={editFormData.reason}
                        onChange={handleEditChange}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">المبلغ</label>
                      <input
                        type="number"
                        name="amount"
                        value={editFormData.amount ?? ''}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
                      >
                        إلغاء
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
                      >
                        حفظ التغييرات
                      </motion.button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">رقم الموعد:</span>
                      <span className="text-gray-800 font-medium">{appt.id || 'غير متوفر'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">اسم المريض:</span>
                      <span className="text-gray-800 font-medium">{appt.patientName || 'غير متوفر'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">الطبيب:</span>
                      <span className="text-gray-800 font-medium">{appt.doctorName || 'غير محدد'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">الحالة:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appt.status === 'في الإنتظار'
                            ? 'bg-yellow-100 text-yellow-800'
                            : appt.status === 'ملغى'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {appt.status || 'غير محدد'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">التاريخ:</span>
                      <span className="text-gray-800 font-medium">
                        {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : 'غير متوفر'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">الوقت:</span>
                      <span className="text-gray-800 font-medium">{appt.time || 'غير متوفر'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">السبب:</span>
                      <span className="text-gray-800 font-medium">{appt.reason || 'لا توجد ملاحظات'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">حالة الدفع:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appt.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {appt.payment ? 'مدفوع' : 'غير مدفوع'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
                      <span className="font-semibold text-gray-700">المبلغ:</span>
                      <span className="text-gray-800 font-medium">
                        {appt.amount ? `${appt.amount} جنيه` : 'غير محدد'}
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg"
                    >
                      تعديل الموعد
                    </motion.button>
                  </div>
                )}
              </ErrorBoundary>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl border border-gray-200"
            >
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-bold text-cyan-800">اختر طريقة الدفع</h5>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <Close />
                </motion.button>
              </div>
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('stripe')}
                  className="btn bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-200 py-2 shadow-sm flex items-center justify-center gap-2"
                >
                  <i className="bi bi-credit-card"></i>
                  دفع عبر Stripe
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePayment('paymob')}
                  className="btn bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 py-2 shadow-sm flex items-center justify-center gap-2"
                >
                  <i className="bi bi-phone"></i>
                  دفع عبر Paymob
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

const NursingAppointments = () => {
  const { appointments, addAppointment, reorderAppointments, fetchAppointments, error } = useAppointmentStore();
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    age: '',
    phoneNumber: '',
    visitType: '',
    notes: '',
    doctor_id: '',
    appointmentDateTime: '',
    status: 'في الإنتظار',
    amount: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const lineChartRef = useRef(null);
  const visitTypeChartRef = useRef(null);
  const doctorChartRef = useRef(null);
  const paymentChartRef = useRef(null);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from('doctors').select('id, name, fees');
      if (error) {
        console.error('Error fetching doctors:', error);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'فشل في جلب قائمة الأطباء. حاول مرة أخرى.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
      } else {
        setDoctors(data || []);
      }
    };
    fetchDoctors();

    const subscription = supabase
      .channel('appointments-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, payload => {
        fetchAppointments();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAppointments]);

  const getChartData = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const dailyCounts = {};
    const completedCounts = {};
    const pendingCounts = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString('ar-EG');
      dailyCounts[dateStr] = 0;
      completedCounts[dateStr] = 0;
      pendingCounts[dateStr] = 0;
    }
    appointments.forEach(appt => {
      if (appt.date) {
        const dateStr = new Date(appt.date).toLocaleDateString('ar-EG');
        if (dailyCounts[dateStr] !== undefined) {
          dailyCounts[dateStr]++;
          if (appt.status === 'تم') {
            completedCounts[dateStr]++;
          } else if (appt.status === 'في الإنتظار') {
            pendingCounts[dateStr]++;
          }
        }
      }
    });

    const visitTypeCounts = {
      فحص: { paid: 0, unpaid: 0 },
      متابعة: { paid: 0, unpaid: 0 },
      استشارة: { paid: 0, unpaid: 0 },
    };
    appointments.forEach(appt => {
      if (appt.visitType && visitTypeCounts[appt.visitType] !== undefined) {
        if (appt.payment) {
          visitTypeCounts[appt.visitType].paid++;
        } else {
          visitTypeCounts[appt.visitType].unpaid++;
        }
      }
    });

    const doctorCounts = {};
    doctors.forEach(doctor => {
      doctorCounts[doctor.name] = 0;
    });
    appointments.forEach(appt => {
      if (appt.doctorName) {
        doctorCounts[appt.doctorName] = (doctorCounts[appt.doctorName] || 0) + 1;
      }
    });

    const paymentCounts = {
      paid: 0,
      unpaid: 0,
    };
    appointments.forEach(appt => {
      if (appt.payment) {
        paymentCounts.paid++;
      } else {
        paymentCounts.unpaid++;
      }
    });

    const todayCount = appointments.filter(
      appt => appt.date && new Date(appt.date).toDateString() === today.toDateString()
    ).length;
    const weekCount = appointments.filter(
      appt => appt.date && new Date(appt.date) >= startOfWeek && new Date(appt.date) <= endOfWeek
    ).length;
    const monthCount = appointments.filter(
      appt => appt.date && new Date(appt.date) >= startOfMonth && new Date(appt.date) <= endOfMonth
    ).length;

    return {
      dailyCounts,
      completedCounts,
      pendingCounts,
      visitTypeCounts,
      doctorCounts,
      paymentCounts,
      todayCount,
      weekCount,
      monthCount,
    };
  };

  const {
    dailyCounts,
    completedCounts,
    pendingCounts,
    visitTypeCounts,
    doctorCounts,
    paymentCounts,
    todayCount,
    weekCount,
    monthCount,
  } = getChartData();

  useEffect(() => {
    if (lineChartRef.current && visitTypeChartRef.current && doctorChartRef.current && paymentChartRef.current) {
      const lineChart = new Chart(lineChartRef.current, {
        type: 'line',
        data: {
          labels: Object.keys(dailyCounts),
          datasets: [
            {
              label: 'جميع المواعيد',
              data: Object.values(dailyCounts),
              borderColor: '#0097A7',
              backgroundColor: 'rgba(0, 151, 167, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'المواعيد المكتملة',
              data: Object.values(completedCounts),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.2)',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'المواعيد في الانتظار',
              data: Object.values(pendingCounts),
              borderColor: '#FFC107',
              backgroundColor: 'rgba(255, 193, 7, 0.2)',
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
          scales: {
            x: {
              title: { display: true, text: 'التاريخ', color: '#333' },
              ticks: { color: '#333' },
            },
            y: {
              title: { display: true, text: 'عدد المواعيد', color: '#333' },
              ticks: { color: '#333' },
              beginAtZero: true,
            },
          },
        },
      });

      const visitTypeChart = new Chart(visitTypeChartRef.current, {
        type: 'pie',
        data: {
          labels: Object.keys(visitTypeCounts).flatMap(type => [`${type} (مدفوع)`, `${type} (غير مدفوع)`]),
          datasets: [
            {
              label: 'عدد المواعيد',
              data: Object.values(visitTypeCounts).flatMap(counts => [counts.paid, counts.unpaid]),
              backgroundColor: ['#00BCD4', '#B2EBF2', '#4DD0E1', '#B2DFDB', '#26A69A', '#80CBC4'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
        },
      });

      const doctorChart = new Chart(doctorChartRef.current, {
        type: 'bar',
        data: {
          labels: Object.keys(doctorCounts),
          datasets: [
            {
              label: 'عدد المواعيد لكل طبيب',
              data: Object.values(doctorCounts),
              backgroundColor: 'rgba(0, 151, 167, 0.6)',
              borderColor: '#0097A7',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
          scales: {
            x: {
              title: { display: true, text: 'الطبيب', color: '#333' },
              ticks: { color: '#333' },
            },
            y: {
              title: { display: true, text: 'عدد المواعيد', color: '#333' },
              ticks: { color: '#333' },
              beginAtZero: true,
            },
          },
        },
      });

      const paymentChart = new Chart(paymentChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['مدفوع', 'غير مدفوع'],
          datasets: [
            {
              label: 'حالة الدفع',
              data: [paymentCounts.paid, paymentCounts.unpaid],
              backgroundColor: ['#4CAF50', '#F44336'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: isMobile ? 'bottom' : 'top',
              labels: { color: '#333' },
            },
            title: { display: false },
          },
        },
      });

      return () => {
        lineChart.destroy();
        visitTypeChart.destroy();
        doctorChart.destroy();
        paymentChart.destroy();
      };
    }
  }, [appointments, doctors, isMobile]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let filtered = appointments;

    if (searchQuery) {
      filtered = filtered.filter(
        appt =>
          appt.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || appt.phoneNumber?.includes(searchQuery)
      );
    }

    switch (filter) {
      case 'today':
        filtered = filtered.filter(appt => appt.date && new Date(appt.date).toDateString() === today.toDateString());
        break;
      case 'tomorrow':
        filtered = filtered.filter(appt => appt.date && new Date(appt.date).toDateString() === tomorrow.toDateString());
        break;
      case 'week':
        filtered = filtered.filter(
          appt => appt.date && new Date(appt.date) >= startOfWeek && new Date(appt.date) <= endOfWeek
        );
        break;
      case 'month':
        filtered = filtered.filter(
          appt => appt.date && new Date(appt.date) >= startOfMonth && new Date(appt.date) <= endOfMonth
        );
        break;
      default:
        filtered = filtered;
    }

    setFilteredAppointments(filtered);
  }, [appointments, filter, searchQuery]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value };
      if (name === 'doctor_id') {
        const selectedDoctor = doctors.find(doctor => String(doctor.id) === value);
        updatedFormData.amount = selectedDoctor ? selectedDoctor.fees : null;
      }
      return updatedFormData;
    });
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const [date, time] = formData.appointmentDateTime.split('T');
      const extendedSchema = Schema.shape({
        doctor_id: Yup.string().required('الطبيب مطلوب'),
        appointmentDateTime: Yup.string().required('تاريخ ووقت الموعد مطلوب'),
      });

      await extendedSchema.validate({ ...formData, date, time }, { abortEarly: false });
      setFormErrors({});

      // Check if patient exists by phone number
      const { data: existingPatient, error: patientCheckError } = await supabase
        .from('patients')
        .select('id, fullName, age, address')
        .eq('phoneNumber', formData.phoneNumber)
        .single();

      let patientId;

      if (patientCheckError && patientCheckError.code !== 'PGRST116') {
        console.error('Error checking patient:', patientCheckError);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: `فشل في التحقق من وجود المريض: ${patientCheckError.message}`,
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (existingPatient) {
        patientId = existingPatient.id;
        // Update patient details if they differ
        if (
          existingPatient.fullName !== formData.fullName ||
          existingPatient.age !== parseInt(formData.age) ||
          existingPatient.address !== formData.address
        ) {
          const { error: updateError } = await supabase
            .from('patients')
            .update({
              fullName: formData.fullName,
              age: parseInt(formData.age),
              address: formData.address,
              updated_at: new Date().toISOString(),
            })
            .eq('id', patientId);
          if (updateError) {
            console.error('Error updating patient:', updateError);
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: `فشل في تحديث بيانات المريض: ${updateError.message}`,
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#d33',
            });
            return;
          }
        }
      } else {
        const patientData = {
          fullName: formData.fullName,
          age: parseInt(formData.age),
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          bookingDate: date,
          visitType: formData.visitType,
        };

        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert([patientData])
          .select('id')
          .single();

        if (patientError) {
          console.error('Error adding patient:', patientError);
          let errorMessage = 'فشل في إضافة المريض.';
          if (patientError.code === '23505') {
            errorMessage = 'رقم الهاتف موجود بالفعل. يرجى استخدام رقم هاتف آخر أو التحقق من المريض.';
          }
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: errorMessage,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#d33',
          });
          return;
        }

        patientId = newPatient.id;
      }

      const appointmentData = {
        date,
        time,
        status: 'في الإنتظار',
        reason: formData.notes || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        patient_id: patientId,
        doctor_id: formData.doctor_id || null,
        visitType: formData.visitType,
      };

      await addAppointment(appointmentData);

      setFormData({
        fullName: '',
        address: '',
        age: '',
        phoneNumber: '',
        visitType: '',
        notes: '',
        doctor_id: '',
        appointmentDateTime: '',
        status: 'في الإنتظار',
        amount: null,
      });
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: 'تم إضافة الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Error submitting appointment:', err);
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'حدث خطأ غير متوقع أثناء إضافة الموعد.',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const moveAppointment = (fromIndex, toIndex) => {
    reorderAppointments(fromIndex, toIndex);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br w-full lg:pr-64 from-gray-50 to-blue-50" dir="rtl">
        <Helmet>
          <title>جدولة المواعيد - نظام المواعيد الطبية</title>
          <meta
            name="description"
            content="جدولة وإدارة مواعيد العيادة بسهولة. إضافة مواعيد، دفع أونلاين، وإدارة حالات المرضى بكفاءة."
          />
          <meta name="keywords" content="جدولة المواعيد, مواعيد طبية, دفع أونلاين, إدارة العيادات, برمجيات طبية" />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="نظام إدارة العيادات" />
          <meta property="og:title" content="جدولة المواعيد - نظام المواعيد الطبية" />
          <meta
            property="og:description"
            content="نظام متقدم لجدولة المواعيد الطبية، يدعم الدفع عبر Stripe وPaymob وإدارة المواعيد بسهولة."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:locale" content="ar_EG" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="جدولة المواعيد - نظام المواعيد الطبية" />
          <meta name="twitter:description" content="جدولة وإدارة المواعيد الطبية بسهولة مع دعم الدفع أونلاين." />
        </Helmet>

        <div className="flex flex-col md:flex-row">
          <NursingSidebar />
          <main className="flex-1 p-4 md:p-6 w-full">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-4 md:p-6 border border-gray-100 mb-6"
            >
              <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <i className="bi bi-graph-up"></i> إحصائيات المواعيد
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 text-center gap-6 mb-6">
                <div>
                  <h6 className="text-sm font-medium">الزيارات اليوم</h6>
                  <p className="text-blue-600 text-xl font-semibold">{todayCount}</p>
                </div>
                <div>
                  <h6 className="text-sm font-medium">الزيارات الأسبوعية</h6>
                  <p className="text-cyan-600 text-xl font-semibold">{weekCount}</p>
                </div>
                <div>
                  <h6 className="text-sm font-medium">الزيارات الشهرية</h6>
                  <p className="text-green-600 text-xl font-semibold">{monthCount}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6 h-[300px]">
                  <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="bi bi-graph-up"></i> المواعيد اليومية
                  </h5>
                  <canvas ref={lineChartRef}></canvas>
                </div>
                <div className="bg-white rounded-lg shadow p-6 h-[300px]">
                  <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="bi bi-pie-chart"></i> أنواع المواعيد حسب حالة الدفع
                  </h5>
                  <canvas ref={visitTypeChartRef}></canvas>
                </div>
                <div className="bg-white rounded-lg shadow p-6 h-[300px]">
                  <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="bi bi-bar-chart"></i> المواعيد حسب الطبيب
                  </h5>
                  <canvas ref={doctorChartRef}></canvas>
                </div>
                <div className="bg-white rounded-lg shadow p-6 h-[300px]">
                  <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="bi bi-pie-chart"></i> حالة الدفع
                  </h5>
                  <canvas ref={paymentChartRef}></canvas>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-xl rounded-2xl p-4 md:p-6 border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shadow-sm"
                  >
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h5 className="text-xl font-bold text-cyan-800">المواعيد المجدولة</h5>
                    <p className="text-sm text-gray-500">إدارة جميع مواعيد العيادة</p>
                  </motion.div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 shadow-md flex items-center"
                >
                  <Add className="ml-2" />
                  إضافة موعد
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو رقم الهاتف..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </motion.div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { value: 'all', label: 'الكل' },
                  { value: 'today', label: 'اليوم' },
                  { value: 'tomorrow', label: 'غدًا' },
                  { value: 'week', label: 'هذا الأسبوع' },
                  { value: 'month', label: 'هذا الشهر' },
                ].map(({ value, label }) => (
                  <motion.button
                    key={value}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilter(value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                      filter === value
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-100 mb-4 shadow-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </motion.div>
              )}

              {filteredAppointments.length === 0 && !error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-800 p-6 rounded-lg border border-blue-100 shadow-sm flex flex-col items-center justify-center text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mb-3 text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold mb-1">
                    {searchQuery ? 'لا توجد نتائج مطابقة للبحث.' : 'لا توجد مواعيد مجدولة بعد'}
                  </h4>
                  <p className="text-sm text-blue-700">اضغط على زر "إضافة موعد" لبدء جدولة المواعيد</p>
                </motion.div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max">
                    <thead className="bg-gradient-to-r from-cyan-50 to-blue-50">
                      <tr>
                        {[
                          !isMobile && 'الرقم',
                          'المريض',
                          !isMobile && 'الطبيب',
                          'الحالة',
                          !isMobile && 'التاريخ',
                          !isMobile && 'الوقت',
                          !isMobile && 'السبب',
                          'حالة الدفع',
                          'الإجراءات',
                        ]
                          .filter(Boolean)
                          .map((header, idx) => (
                            <motion.th
                              key={idx}
                              initial={{ y: -20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: idx * 0.05 + 0.2 }}
                              scope="col"
                              className="px-6 py-3 text-right font-semibold text-cyan-800"
                            >
                              {header}
                            </motion.th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAppointments.map((appt, index) => (
                        <AppointmentItem key={appt.id} appt={appt} index={index} moveAppointment={moveAppointment} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            <AnimatePresence>
              {showModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h5 className="text-xl font-bold text-cyan-800">إضافة موعد</h5>
                      <motion.button
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setShowModal(false);
                          setFormErrors({});
                        }}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        <Close />
                      </motion.button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-4">
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
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
                          {formErrors.phoneNumber && (
                            <p className="text-red-600 text-sm mt-1">{formErrors.phoneNumber}</p>
                          )}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
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
                          transition={{ delay: 0.2 }}
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
                          <label
                            htmlFor="appointmentDateTime"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            تاريخ ووقت الموعد
                          </label>
                          <input
                            type="datetime-local"
                            className={`w-full p-3 border ${
                              formErrors.appointmentDateTime ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                            id="appointmentDateTime"
                            name="appointmentDateTime"
                            value={formData.appointmentDateTime}
                            onChange={handleChange}
                            required
                          />
                          {formErrors.appointmentDateTime && (
                            <p className="text-red-600 text-sm mt-1">{formErrors.appointmentDateTime}</p>
                          )}
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
                          <label htmlFor="doctor_id" className="block text-sm font-semibold text-gray-700 mb-2">
                            الطبيب
                          </label>
                          <select
                            className={`w-full p-3 border ${
                              formErrors.doctor_id ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200`}
                            id="doctor_id"
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="">اختر الطبيب</option>
                            {doctors.map(doctor => (
                              <option key={doctor.id} value={doctor.id}>
                                {doctor.name} (رسوم: {doctor.fees} جنيه)
                              </option>
                            ))}
                          </select>
                          {formErrors.doctor_id && <p className="text-red-600 text-sm mt-1">{formErrors.doctor_id}</p>}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.45 }}
                        >
                          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                            المبلغ (جنيه مصري)
                          </label>
                          <input
                            type="number"
                            className={`w-full p-3 border ${
                              formErrors.amount ? 'border-red-300' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 bg-gray-100 cursor-not-allowed`}
                            id="amount"
                            name="amount"
                            value={formData.amount ?? ''}
                            readOnly
                          />
                          {formErrors.amount && <p className="text-red-600 text-sm mt-1">{formErrors.amount}</p>}
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
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
                          transition={{ delay: 0.55 }}
                          className="flex justify-end gap-3 pt-4"
                        >
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                              setShowModal(false);
                              setFormErrors({});
                            }}
                            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
                          >
                            إلغاء
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg hover:from-cyan-700 hover:to-cyan-800 transition-all duration-300 shadow-md"
                          >
                            إضافة الموعد
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
      </div>
    </DndProvider>
  );
};

export default NursingAppointments;
