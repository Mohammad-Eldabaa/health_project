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
  setSelectedMedications: (meds) => set({ selectedMedications: meds }),

  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),

  

  setPrescriptions: prescriptions => set({ prescriptions }),
  setTests: tests => set({ tests }),

  setPatients: patients => set({ patients }),
  setAppointments: appointments => set({ appointments }),
  setDoctors: doctors => set({ doctors }),
  setDrug_categories: drug_categories => set({ drug_categories }),
  setDosage_options: dosage_options => set({ dosage_options }),
  setDuration_options: duration_options => set({ duration_options }),

  fetchData: async () => {
    set({ loading: true, error: null });

    const { data: appointmentsData, error: appointmentsError } = await supabase.from('appointments').select('*');
    const { data: doctorsData, error: doctorsError } = await supabase.from('doctors').select('*');
    const { data: patientsData, error: patientsError } = await supabase.from('patients').select(`
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
`);
    const { data: visitsData, error: visitsError } = await supabase.from('visits').select('*');
    const { data: recordsData, error: recordsError } = await supabase.from('medical_records').select('*');
    const { data: prescriptionsData, error: prescriptionsError } = await supabase.from('prescriptions').select(`
    *,
    prescription_medications (
      *,
      medication:medications (
        id,
        name
      )
    )
  `);
    const { data: prescription_medicationsData, error: prescription_medicationsError } = await supabase
      .from('prescription_medications')
      .select('*');
    const { data: testsData, error: testsError } = await supabase.from('tests').select('*');
    const { data: test_requestsData, error: test_requestsError } = await supabase.from('test_requests').select(`
    *,
    tests (
      id,
      name,
      description
    ),
    visits (
      patient_id
    )
  `);
    const { data: drug_categoriesData, error: drug_categoriesError } = await supabase.from('drug_categories').select(`
    name,
    medications:medications (
      name
    )
  `);
  const{data:dosage_optionsData, error: dosage_optionsError} = await supabase.from('dosage_options').select('*');
  const {data:duration_optionsData, error: duration_optionsError} = await supabase.from('duration_options').select('*');

    console.log('Fetched patients data:', patientsData);

    if (
      appointmentsError ||
      patientsError ||
      visitsError ||
      recordsError ||
      prescriptionsError ||
      prescription_medicationsError ||
      test_requestsError ||
      doctorsError ||
      drug_categoriesError||
      dosage_optionsError||
      duration_optionsError||
      testsError
    ) {
      set({
        error:
          appointmentsError?.message ||
          patientsError?.message ||
          visitsError?.message ||
          recordsError?.message ||
          prescriptionsError?.message ||
          prescription_medicationsError?.message ||
          testsError?.message ||
          doctorsError?.message ||
          test_requestsError?.message ||
          dosage_optionsError?.message ||
          duration_optionsError?.message ||
          drug_categoriesError?.message,
        loading: false,
      });
      return;
    }

    set({
      appointments: appointmentsData,
      patients: patientsData,
      visits: visitsData,
      records: recordsData,
      prescriptions: prescriptionsData,
      prescription_medications: prescription_medicationsData,
      tests: testsData,
      test_requests: test_requestsData,
      doctors: doctorsData,
      drug_categories: drug_categoriesData,
      dosage_options: dosage_optionsData,
      duration_options: duration_optionsData,
      loading: false,
    });

    const current = appointmentsData.find(a => a.status === 'قيد الكشف');
    set({ currentVisit: current || null });
  },

  startVisit: async appointmentId => {
    const { error } = await supabase.from('appointments').update({ status: 'قيد الكشف' }).eq('id', appointmentId);
    if (error) return console.error('خطأ في بدء الكشف:', error.message);

    set(state => {
      const updated = state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'قيد الكشف' } : app));
      const current = updated.find(app => app.id === appointmentId);
      return {
        appointments: updated,
        currentVisit: current,
      };
    });
  },

  endVisit: async appointmentId => {
    const { data: appointmentData, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointmentData) return console.error('فشل في جلب بيانات الموعد:', fetchError?.message);

    const { error: updateError } = await supabase.from('appointments').update({ status: 'تم' }).eq('id', appointmentId);
    if (updateError) return console.error('فشل في تحديث الحالة:', updateError.message);

    const { error: visitError } = await supabase.from('visits').insert([
      {
        appointment_id: appointmentData.id,
        patient_id: appointmentData.patient_id,
        doctor_id: appointmentData.doctor_id,
        date: new Date().toISOString(),
        notes: '',
      },
    ]);

    if (visitError) return console.error('فشل في تسجيل الزيارة:', visitError.message);

    set(state => ({
      appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'تم' } : app)),
      currentVisit: null,
    }));
  },

  exetVisit: async appointmentId => {
    const { error } = await supabase.from('appointments').update({ status: 'ملغي' }).eq('id', appointmentId);
    if (error) return console.error('خطأ في إلغاء الكشف:', error.message);

    set(state => ({
      appointments: state.appointments.map(app => (app.id === appointmentId ? { ...app, status: 'ملغي' } : app)),
      currentVisit: null,
    }));
  },
}));

export default useDoctorDashboardStore;
