import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';
import * as Yup from 'yup';
import { Schema } from '../nursingBookingSchema';
import Swal from 'sweetalert2';
import useAppointmentStore from '../../../store/appointmentStore';
import { supabase } from '../../../supaBase/NursingBooking';

export const AppointmentModal = ({
  showModal,
  setShowModal,
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  doctors,
}) => {
  const { addAppointment } = useAppointmentStore();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'doctor_id' && {
        amount: doctors.find(d => String(d.id) === value)?.fees || null,
      }),
    }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await Schema.validate(formData, { abortEarly: false });

      const [date, time] = formData.appointmentDateTime.split('T');
      const patientData = {
        fullName: formData.fullName,
        address: formData.address,
        age: parseInt(formData.age),
        phoneNumber: formData.phoneNumber,
      };

      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('phoneNumber', formData.phoneNumber)
        .single();

      let patientId;
      if (existingPatient) {
        patientId = existingPatient.id;
      } else {
        const { data: newPatient, error: insertError } = await supabase
          .from('patients')
          .insert([patientData])
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting patient:', insertError);
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: `فشل في إضافة المريض: ${insertError.message}`,
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#d33',
          });
          return;
        }
        patientId = newPatient.id;
      }

      const appointmentData = {
        patient_id: patientId,
        doctor_id: parseInt(formData.doctor_id),
        date,
        time,
        visitType: formData.visitType,
        status: formData.status,
        payment: formData.payment,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        notes: formData.notes || null,
      };

      await addAppointment(appointmentData);
      setShowModal(false);
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
        payment: false,
      });
      setFormErrors({});
      Swal.fire({
        icon: 'success',
        title: 'تمت الإضافة',
        text: 'تم إضافة الموعد بنجاح!',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#3085d6',
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = {};
        err.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Unexpected error:', err);
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

  return (
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
              <h5 className="text-xl font-bold text-cyan-800">إضافة موعد جديد</h5>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label htmlFor="appointmentDateTime" className="block text-sm font-semibold text-gray-700 mb-2">
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
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
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 }}>
                  <label htmlFor="payment" className="block text-sm font-semibold text-gray-700 mb-2">
                    حالة الدفع
                  </label>
                  <input
                    type="checkbox"
                    className="p-3 border border-gray-300 rounded-lg"
                    id="payment"
                    name="payment"
                    checked={formData.payment}
                    onChange={e => setFormData(prev => ({ ...prev, payment: e.target.checked }))}
                  />
                  <span className="ml-2">{formData.payment ? 'مدفوع' : 'غير مدفوع'}</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
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
  );
};
