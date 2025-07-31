import { create } from 'zustand';
import { supabase } from '../supaBase/booking';

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  error: null,

  fetchAppointments: async () => {
    try {
      const { data, error } = await supabase.from('Appointments').select('*').order('order_index', { ascending: true });

      if (error) {
        console.error('Error fetching appointments:', error.message, error.details);
        set({ error: `فشل في جلب المواعيد: ${error.message}` });
        return;
      }

      set({ appointments: data || [], error: null });
    } catch (err) {
      console.error('Unexpected error fetching appointments:', err);
      set({ error: 'حدث خطأ غير متوقع أثناء جلب المواعيد.' });
    }
  },

  addAppointment: async appointment => {
    try {
      const { appointments } = get();
      const newAppointment = {
        ...appointment,
        id: crypto.randomUUID(),
        order_index: appointments.length,
      };

      const { error } = await supabase.from('Appointments').insert([newAppointment]);

      if (error) {
        console.error('Error adding appointment:', error.message, error.details);
        alert(`فشل في إضافة الموعد: ${error.message}`);
        return;
      }

      set(state => ({
        appointments: [...state.appointments, newAppointment],
        error: null,
      }));
    } catch (err) {
      console.error('Unexpected error adding appointment:', err);
      alert('حدث خطأ غير متوقع أثناء إضافة الموعد.');
    }
  },

  cancelAppointment: async id => {
    try {
      const { error } = await supabase.from('Appointments').delete().eq('id', id);

      if (error) {
        console.error('Error canceling appointment:', error.message, error.details);
        alert(`فشل في إلغاء الموعد: ${error.message}`);
        return;
      }

      set(state => ({
        appointments: state.appointments.filter(appt => appt.id !== id),
        error: null,
      }));

      // Update order_index for remaining appointments
      const { appointments } = get();
      const updates = appointments.map((appt, index) => ({
        id: appt.id,
        order_index: index,
      }));

      const { error: updateError } = await supabase.from('Appointments').upsert(updates, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

      if (updateError) {
        console.error('Error updating order_index:', updateError.message, updateError.details);
        alert(`فشل في تحديث ترتيب المواعيد: ${updateError.message}`);
      }
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

      // Update order_index in Supabase
      const updates = newAppointments.map((appt, index) => ({
        id: appt.id,
        order_index: index,
      }));

      const { error } = await supabase.from('Appointments').upsert(updates, {
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
