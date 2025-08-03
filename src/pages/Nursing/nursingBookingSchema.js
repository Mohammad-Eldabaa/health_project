import * as Yup from 'yup';
import { addPatient } from '../../supaBase/NursingBooking';

export const Schema = Yup.object({
  fullName: Yup.string().required('الاسم مطلوب').min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  address: Yup.string().required('العنوان مطلوب').min(3, 'برجاء دخال اسم المحافظة على الأقل'),
  age: Yup.number().required('العمر مطلوب').min(1, 'برجاء دخال عمر صحيح').max(120, 'العمر لا يزيد عن 120'),
  phoneNumber: Yup.string()
    .required('رقم الهاتف مطلوب')
    .matches(/^01[0125][0-9]{8}$/, 'برجاء دخال رقم هاتف صحيح'),
  appointmentDateTime: Yup.string().required('تاريخ ووقت الموعد مطلوب'),
  visitType: Yup.string().required('نوع الزيارة مطلوب'),
  notes: Yup.string().max(700, 'الملاحظات لا يجب أن تتجاوز 700 حرف'),
  amount: Yup.number()
    .nullable()
    .min(1, 'المبلغ يجب أن يكون أكبر من 0')
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
});

export const formData = {
  fullName: '',
  address: '',
  age: '',
  phoneNumber: '',
  appointmentDateTime: '',
  visitType: '',
  notes: '',
  amount: '',
};

export const handleSubmit = (values, { resetForm }) => {
  console.log('Booking submitted:', values);
  const [date, time] = values.appointmentDateTime.split('T');
  const patientData = {
    ...values,
    bookingDate: date,
  };
  addPatient(patientData, resetForm);
};
