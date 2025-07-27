// import { create } from 'zustand';
// import { supabase } from '../supaBase/booking';

// const useDoctorDashboardStore = create(set => ({
//     appointments: [],
//     patients: [],
//     loading: false,
//     error: null,

//     fetchData: async () => {
//         set({ loading: true, error: null });

//         const { data: appointmentsData, error: appointmentsError } = await supabase.from('appointments').select('*');
//         const { data: patientsData, error: patientsError } = await supabase.from('patients').select('*');

//         if (appointmentsError || patientsError) {
//             set({ error: appointmentsError?.message || patientsError?.message, loading: false });
//             return;
//         }

//         set({
//             appointments: appointmentsData,
//             patients: patientsData,
//             loading: false,
//         });
//     },

//     // ✅ دالة بدء الكشف
// startVisit: async (appointmentId) => {
//     // تحديث الحالة في Supabase أولاً
//     const { error } = await supabase.from('appointments').update({ status: 'قيد الكشف' }).eq('id', appointmentId);

//     if (error) {
//         console.error('خطأ في تحديث Supabase:', error.message);
//         return;
//     }

//     // تحديث الحالة محليًا في Zustand
//     set(state => ({
//         appointments: state.appointments.map(app =>
//             app.id === appointmentId ? { ...app, status: 'قيد الكشف' } : app
//         ),
//     }));
// },

//     // ✅ دالة إنهاء الكشف
//     endVisit: async appointmentId => {
//         // تحديث الحالة في Supabase أولاً
//         const { error } = await supabase.from('appointments').update({ status: 'تم' }).eq('id', appointmentId);

//         if (error) {
//             console.error('خطأ في تحديث Supabase:', error.message);
//             return;
//         }

//         // تحديث الحالة محليًا في Zustand
//         set(state => ({
//             appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'تم' } : app)),
//         }));
//     },

//     exetVisit: async appointmentId => {
//         // تحديث الحالة في Supabase أولاً
//         const { error } = await supabase.from('appointments').update({ status: 'ملغي' }).eq('id', appointmentId);

//         if (error) {
//             console.error('خطأ في تحديث Supabase:', error.message);
//             return;
//         }

//         // تحديث الحالة محليًا في Zustand
//         set(state => ({
//             appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'ملغي' } : app)),
//         }));
//     },
// }));
// export default useDoctorDashboardStore;

import { create } from 'zustand';
import { supabase } from '../supaBase/booking';

const useDoctorDashboardStore = create(set => ({
    appointments: [],
    patients: [],
    currentVisit: null,
    loading: false,
    error: null,

    // تحميل البيانات من Supabase
    fetchData: async () => {
        set({ loading: true, error: null });

        const { data: appointmentsData, error: appointmentsError } = await supabase.from('appointments').select('*');
        const { data: patientsData, error: patientsError } = await supabase.from('patients').select('*');

        if (appointmentsError || patientsError) {
            set({ error: appointmentsError?.message || patientsError?.message, loading: false });
            return;
        }

        set({
            appointments: appointmentsData,
            patients: patientsData,
            loading: false,
        });

        // ✅ تحقق إذا في مريض قيد الكشف حاليًا
        const current = appointmentsData.find(a => a.status === 'قيد الكشف');
        if (current) {
            set({ currentVisit: current });
        } else {
            set({ currentVisit: null });
        }
    },

    // ✅ بدء الكشف: تعديل status وتعيين currentVisit
    startVisit: async appointmentId => {
        const {error } = await supabase.from('appointments').update({ status: 'قيد الكشف' }).eq('id', appointmentId);

        if (error) {
            console.error('خطأ في بدء الكشف:', error.message);
            return;
        }

        set(state => {
            const updated = state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'قيد الكشف' } : app));
            const current = updated.find(app => app.id === appointmentId);
            return {
                appointments: updated,
                currentVisit: current,
            };
        });
    },

    // ✅ إنهاء الكشف: تعديل status وتصفيه currentVisit
    endVisit: async appointmentId => {
        const { error } = await supabase.from('appointments').update({ status: 'تم' }).eq('id', appointmentId);
        if (error) {
            console.error('خطأ في إنهاء الكشف:', error.message);
            return;
        }

        set(state => ({
            appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'تم' } : app)),
            currentVisit: null,
        }));
    },

    // ✅ إلغاء الكشف: تعديل status وتصفيه currentVisit
    exetVisit: async appointmentId => {
        const { error } = await supabase.from('appointments').update({ status: 'ملغي' }).eq('id', appointmentId);
        if (error) {
            console.error('خطأ في إلغاء الكشف:', error.message);
            return;
        }

        set(state => ({
            appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'ملغي' } : app)),
            currentVisit: null,
        }));
    },
}));

export default useDoctorDashboardStore;
