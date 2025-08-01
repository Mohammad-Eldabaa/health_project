import { create } from 'zustand';
import { supabase } from '../supaBase/booking';

const useDoctorDashboardStore = create(set => ({
  appointments: [],
  patients: [],
  currentVisit: null,
  loading: false,
  error: null,
  prescriptions: [],
  tests: [],
  doctors: [],
  drug_categories: [],
  dosage_options: [],
  duration_options: [],

  selectedMedications: [],
  setSelectedMedications: meds => set({ selectedMedications: meds }),
  selectedPatient: null,
  setSelectedPatient: patient => set({ selectedPatient: patient }),
  setPrescriptions: prescriptions => set({ prescriptions }),
  setTests: tests => set({ tests }),
  setPatients: patients => set({ patients }),
  setAppointments: appointments => set({ appointments }),
  setDoctors: doctors => set({ doctors }),
  setDrug_categories: drug_categories => set({ drug_categories }),
  setDosage_options: dosage_options => set({ dosage_options }),
  setDuration_options: duration_options => set({ duration_options }),
  setVisits: visits => set({ visits }),
  setPrescriptionMedications: prescription_medications => set({ prescription_medications }),
  setTestRequests: test_requests => set({ test_requests }),
  setRecords: records => set({ records }),

  fetchData: async () => {
    set({ loading: true, error: null });

    try {
      const [
        { data: appointmentsData },
        { data: doctorsData },
        { data: patientsData },
        { data: visitsData },
        { data: recordsData },
        { data: prescriptionsData },
        { data: prescription_medicationsData },
        { data: testsData },
        { data: test_requestsData },
        { data: drug_categoriesData },
        { data: dosage_optionsData },
        { data: duration_optionsData },
      ] = await Promise.all([
        supabase.from('appointments').select('*'),
        supabase.from('doctors').select('*'),
        supabase.from('patients').select(`
        *,
        visits (
          *,
          prescriptions (
            *,
            prescription_medications (
              *,
              medication:medications (*)
            )
          )
        )
      `),
        supabase.from('visits').select('*'),
        supabase.from('medical_records').select('*'),
        supabase.from('prescriptions').select(`
        *,
        prescription_medications (
          *,
          medication:medications (id, name)
        )
      `),
        supabase.from('prescription_medications').select('*'),
        supabase.from('tests').select('*').order("created_at", { ascending: false }),
        supabase.from('test_requests').select(`
        *,
        tests (id, name, description),
        visits (patient_id)
      `),
        supabase.from('drug_categories').select(`
        name,
        medications:medications (name)
      `),
        supabase.from('dosage_options').select('*'),
        supabase.from('duration_options').select('*'),
      ]);

      set({
        appointments: appointmentsData || [],
        patients: patientsData || [],
        visits: visitsData || [],
        records: recordsData || [],
        prescriptions: prescriptionsData || [],
        prescription_medications: prescription_medicationsData || [],
        tests: testsData || [],
        test_requests: test_requestsData || [],
        doctors: doctorsData || [],
        drug_categories: drug_categoriesData || [],
        dosage_options: dosage_optionsData || [],
        duration_options: duration_optionsData || [],
        loading: false,
      });

      const currentVisit = appointmentsData?.find(a => a.status === 'قيد الكشف');
      set({ currentVisit: currentVisit || null });
    } catch (error) {
      set({
        error: error.message,
        loading: false,
      });
      console.error('Error fetching data:', error);
    }
  },

  startVisit: async appointmentId => {
    try {
      const { error } = await supabase.from('appointments').update({ status: 'قيد الكشف' }).eq('id', appointmentId);

      if (error) throw error;

      set(state => {
        const updatedAppointments = state.appointments.map(app =>
          app.id === appointmentId ? { ...app, status: 'قيد الكشف' } : app
        );
        return {
          appointments: updatedAppointments,
          currentVisit: updatedAppointments.find(app => app.id === appointmentId),
        };
      });
    } catch (error) {
      console.error('خطأ في بدء الكشف:', error.message);
    }
  },

  endVisit: async appointmentId => {
    try {
      const { data: appointmentData, error: fetchError } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (fetchError || !appointmentData) throw fetchError;

      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'تم' })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      const { error: visitError } = await supabase.from('visits').insert([
        {
          appointment_id: appointmentData.id,
          patient_id: appointmentData.patient_id,
          doctor_id: appointmentData.doctor_id,
          date: new Date().toISOString(),
          notes: '',
        },
      ]);

      if (visitError) throw visitError;

      set(state => ({
        appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'تم' } : app)),
        currentVisit: null,
      }));
    } catch (error) {
      console.error('فشل في إنهاء الزيارة:', error.message);
    }
  },

  exetVisit: async appointmentId => {
    try {
      const { error } = await supabase.from('appointments').update({ status: 'ملغي' }).eq('id', appointmentId);

      if (error) throw error;

      set(state => ({
        appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'ملغي' } : app)),
        currentVisit: null,
      }));
    } catch (error) {
      console.error('خطأ في إلغاء الكشف:', error.message);
    }
  },

  updateAppointmentStatus: (appointmentId, newStatus) => {
    set(state => ({
      appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: newStatus } : app)),
      currentVisit:
        newStatus === 'قيد الكشف'
          ? state.appointments.find(app => app.id === appointmentId)
          : state.currentVisit?.id === appointmentId
          ? null
          : state.currentVisit,
    }));
  },
}));

export default useDoctorDashboardStore;
