import { create } from 'zustand';
import { supabase } from '../supaBase/booking';

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  error: null,

  fetchAppointments: async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(
          `
          id,
          created_at,
          date,
          time,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name)
        `
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        set({ error: `فشل في جلب المواعيد: ${error.message}` });
        return;
      }

      const formattedAppointments = data.map(appt => ({
        id: appt.id,
        date: appt.date,
        time: appt.time,
        status: appt.status,
        reason: appt.reason || '',
        payment: appt.payment,
        cancelled: appt.cancelled,
        amount: appt.amount,
        patient_id: appt.patient_id,
        patientName: appt.patients?.fullName || 'غير محدد',
        doctor_id: appt.doctor_id,
        doctorName: appt.doctors?.name || 'غير محدد',
      }));

      set({ appointments: formattedAppointments || [], error: null });
    } catch (err) {
      console.error('Unexpected error fetching appointments:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      set({ error: 'حدث خطأ غير متوقع أثناء جلب المواعيد.' });
    }
  },

  addAppointment: async appointment => {
    try {
      const newAppointment = {
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        reason: appointment.reason || null,
        amount: appointment.amount || null,
        payment: false,
        cancelled: false,
        patient_id: appointment.patient_id || null,
        doctor_id: appointment.doctor_id || null,
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([newAppointment])
        .select(
          `
          id,
          created_at,
          date,
          time,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name)
        `
        )
        .single();

      if (error) {
        console.error('Error adding appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        alert(`فشل في إضافة الموعد: ${error.message}`);
        return;
      }

      const formattedNewAppointment = {
        id: data.id,
        date: data.date,
        time: data.time,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
      };

      set(state => ({
        appointments: [...state.appointments, formattedNewAppointment],
        error: null,
      }));
    } catch (err) {
      console.error('Unexpected error adding appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      alert('حدث خطأ غير متوقع أثناء إضافة الموعد.');
    }
  },

  updateAppointment: async (id, updatedData) => {
    try {
      console.log('Updating appointment with ID:', id, 'Data:', updatedData);
      const { data, error } = await supabase
        .from('appointments')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(
          `
          id,
          created_at,
          date,
          time,
          status,
          reason,
          payment,
          cancelled,
          amount,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name)
        `
        )
        .single();

      if (error) {
        console.error('Error updating appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        alert(`فشل في تحديث الموعد: ${error.message}${error.details ? ` - ${error.details}` : ''}`);
        return;
      }

      if (!data) {
        throw new Error('No data returned from update operation');
      }

      const formattedUpdatedAppointment = {
        id: data.id,
        date: data.date,
        time: data.time,
        status: data.status,
        reason: data.reason || '',
        payment: data.payment,
        cancelled: data.cancelled,
        amount: data.amount,
        patient_id: data.patient_id,
        patientName: data.patients?.fullName || 'غير محدد',
        doctor_id: data.doctor_id,
        doctorName: data.doctors?.name || 'غير محدد',
      };

      set(state => ({
        appointments: state.appointments.map(appt => (appt.id === id ? formattedUpdatedAppointment : appt)),
        error: null,
      }));
      alert('تم تحديث الموعد بنجاح!');
    } catch (err) {
      console.error('Unexpected error updating appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      alert('حدث خطأ غير متوقع أثناء تحديث الموعد.');
    }
  },

  cancelAppointment: async id => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ cancelled: true, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error canceling appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        alert(`فشل في إلغاء الموعد: ${error.message}`);
        return;
      }

      set(state => ({
        appointments: state.appointments.filter(appt => appt.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error('Unexpected error canceling appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      alert('حدث خطأ غير متوقع أثناء إلغاء الموعد.');
    }
  },

  deleteAppointment: async id => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);

      if (error) {
        console.error('Error deleting appointment:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        alert(`فشل في حذف الموعد: ${error.message}`);
        return;
      }

      set(state => ({
        appointments: state.appointments.filter(appt => appt.id !== id),
        error: null,
      }));
      alert('تم حذف الموعد بنجاح!');
    } catch (err) {
      console.error('Unexpected error deleting appointment:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      alert('حدث خطأ غير متوقع أثناء حذف الموعد.');
    }
  },

  reorderAppointments: async (startIndex, endIndex) => {
    try {
      const { appointments } = get();
      const newAppointments = [...appointments];
      const [reorderedItem] = newAppointments.splice(startIndex, 1);
      newAppointments.splice(endIndex, 0, reorderedItem);

      const updates = newAppointments.map((appt, index) => ({
        id: appt.id,
        created_at: new Date(Date.now() + index * 1000).toISOString(),
        date: appt.date,
        time: appt.time,
        status: appt.status,
        reason: appt.reason || null,
        payment: appt.payment,
        cancelled: appt.cancelled,
        amount: appt.amount,
        patient_id: appt.patient_id,
        doctor_id: appt.doctor_id,
      }));

      const { error } = await supabase.from('appointments').upsert(updates, {
        onConflict: ['id'],
        returning: 'minimal',
      });

      if (error) {
        console.error('Error reordering appointments:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        alert(`فشل في إعادة ترتيب المواعيد: ${error.message}`);
        return;
      }

      set({ appointments: newAppointments, error: null });
    } catch (err) {
      console.error('Unexpected error reordering appointments:', {
        error: err,
        message: err?.message || 'No message provided',
        stack: err?.stack || 'No stack trace available',
      });
      alert('حدث خطأ غير متوقع أثناء إعادة ترتيب المواعيد.');
    }
  },
}));

export default useAppointmentStore;
