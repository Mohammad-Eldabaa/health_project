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
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name)
        `
        )
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error.message, error.details);
        set({ error: `فشل في جلب المواعيد: ${error.message}` });
        return;
      }

      // Map data to include patient and doctor names for display
      const formattedAppointments = data.map(appt => ({
        id: appt.id,
        date: appt.date,
        time: appt.time,
        status: appt.status,
        reason: appt.reason || '',
        patient_id: appt.patient_id,
        patientName: appt.patients?.fullName || 'غير محدد',
        doctor_id: appt.doctor_id,
        doctorName: appt.doctors?.name || 'غير محدد',
      }));

      set({ appointments: formattedAppointments || [], error: null });
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
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
        patient_id: appointment.patient_id || null,
        doctor_id: appointment.doctor_id || null,
      };

      const { error } = await supabase.from('appointments').insert([newAppointment]);

      if (error) {
        console.error('Error adding appointment:', error.message, error.details);
        alert(`فشل في إضافة الموعد: ${error.message}`);
        return;
      }

      // Fetch the newly added appointment to get patient and doctor names
      const { data: newData, error: fetchError } = await supabase
        .from('appointments')
        .select(
          `
          id,
          created_at,
          date,
          time,
          status,
          reason,
          patient_id,
          patients (id, fullName),
          doctor_id,
          doctors (id, name)
        `
        )
        .eq(
          'id',
          (
            await supabase.from('appointments').select('id').order('created_at', { ascending: false }).limit(1)
          ).data[0].id
        )
        .single();

      if (fetchError) {
        console.error('Error fetching new appointment:', fetchError);
        alert('تمت إضافة الموعد ولكن فشل في جلب التفاصيل.');
        return;
      }

      const formattedNewAppointment = {
        id: newData.id,
        date: newData.date,
        time: newData.time,
        status: newData.status,
        reason: newData.reason || '',
        patient_id: newData.patient_id,
        patientName: newData.patients?.name || 'غير محدد',
        doctor_id: newData.doctor_id,
        doctorName: newData.doctors?.name || 'غير محدد',
      };

      set(state => ({
        appointments: [...state.appointments, formattedNewAppointment],
        error: null,
      }));
    } catch (err) {
      console.error('Unexpected error adding appointment:', err);
      alert('حدث خطأ غير متوقع أثناء إضافة الموعد.');
    }
  },

  cancelAppointment: async id => {
    try {
      const { error } = await supabase.from('appointments').delete().eq('id', id);

      if (error) {
        console.error('Error canceling appointment:', error.message, error.details);
        alert(`فشل في إلغاء الموعد: ${error.message}`);
        return;
      }

      set(state => ({
        appointments: state.appointments.filter(appt => appt.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error('Unexpected error canceling appointment:', err);
      alert('حدث خطأ غير متوقع أثناء إلغاء الموعد.');
    }
  },

  reorderAppointments: async (startIndex, endIndex) => {
    try {
      const { appointments } = get();
      const newAppointments = [...appointments];
      const [reorderedItem] = newAppointments.splice(startIndex, 1);
      newAppointments.splice(endIndex, 0, reorderedItem);

      // Since order_index isn't in the schema, we'll update created_at to simulate ordering
      const updates = newAppointments.map((appt, index) => ({
        id: appt.id,
        created_at: new Date(Date.now() + index * 1000).toISOString(), // Increment timestamp
      }));

      const { error } = await supabase.from('appointments').upsert(updates, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

      if (error) {
        console.error('Error reordering appointments:', error.message, error.details);
        alert(`فشل في إعادة ترتيب المواعيد: ${error.message}`);
        return;
      }

      set({ appointments: newAppointments, error: null });
    } catch (err) {
      console.error('Unexpected error reordering appointments:', err);
      alert('حدث خطأ غير متوقع أثناء إعادة ترتيب المواعيد.');
    }
  },
}));

export default useAppointmentStore;
