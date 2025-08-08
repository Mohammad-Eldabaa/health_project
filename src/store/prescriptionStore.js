// import { create } from 'zustand';
// import { supabase } from '../supaBase/booking';
// import useDoctorDashboardStore from "../store/doctorDashboardStore";

// export const usePrescriptionStore = create((set, get) => ({
//   medications: [],
//   medicationCategories: [],
//   dosageOptions: ['مرة يومياً', 'مرتين يومياً', 'كل 8 ساعات', 'كل 12 ساعة', 'حسب الحاجة', 'قبل الأكل', 'بعد الأكل'],
//   durationOptions: [
//     'لمدة يوم واحد',
//     'لمدة 3 أيام',
//     'لمدة أسبوع',
//     'لمدة 10 أيام',
//     'لمدة أسبوعين',
//     'لمدة شهر',
//     'حسب التعليمات',
//   ],
//   selectedMedications: [],
//   currentPrescription: null,
//   patientPrescriptions: [],
//   loading: false,
//   error: null,
//   realtimeChannel: null,

//   // Initialize real-time subscriptions
//   initRealtime: patientId => {
//     // Clean up any existing channel
//     if (get().realtimeChannel) {
//       supabase.removeChannel(get().realtimeChannel);
//     }

//     // Get visits filter for the patient
//     const getVisitsFilter = async () => {
//       const { data } = await supabase.from('visits').select('id').eq('patient_id', patientId);
//       return data?.map(v => v.id).join(',') || '';
//     };

//     // Get prescriptions filter for the patient
//     const getPrescriptionsFilter = async () => {
//       const { data } = await supabase.from('visits').select('prescriptions(id)').eq('patient_id', patientId);
//       return data?.flatMap(v => v.prescriptions?.map(p => p.id)).join(',') || '';
//     };

//     // Setup real-time subscriptions
//     const channel = supabase
//       .channel('realtime_prescriptions')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'prescriptions',
//           filter: `visit_id=in.(${getVisitsFilter()})`,
//         },
//         async () => {
//           await get().fetchPatientPrescriptions(patientId);
//         }
//       )
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'prescription_medications',
//           filter: `prescription_id=in.(${getPrescriptionsFilter()})`,
//         },
//         async () => {
//           await get().fetchPatientPrescriptions(patientId);
//         }
//       )
//       .subscribe();

//     set({ realtimeChannel: channel });
//   },

//   // Clean up real-time subscriptions
//   cleanupRealtime: () => {
//     if (get().realtimeChannel) {
//       supabase.removeChannel(get().realtimeChannel);
//       set({ realtimeChannel: null });
//     }
//   },

//   fetchMedicationData: async () => {
//     set({ loading: true, error: null });
//     try {
//       const [medsResult, catsResult] = await Promise.all([
//         supabase.from('medications').select('*'),
//         supabase.from('drug_categories').select('*'),
//       ]);

//       set({
//         medications: medsResult.data || [],
//         medicationCategories: catsResult.data || [],
//         loading: false,
//       });
//     } catch (error) {
//       set({ error: error.message, loading: false });
//     }
//   },

//   addMedication: medication => {
//     set(state => ({
//       selectedMedications: [
//         ...state.selectedMedications,
//         {
//           ...medication,
//           id: Date.now() + Math.random(),
//         },
//       ],
//     }));
//   },

//   removeMedication: id => {
//     set(state => ({
//       selectedMedications: state.selectedMedications.filter(med => med.id !== id),
//     }));
//   },

//   savePrescription: async (patientId, visitId, prescriptionData) => {
//     set({ loading: true });
//     try {
//       const { data: prescription, error: presError } = await supabase
//         .from('prescriptions')
//         .insert({
//           visit_id: visitId,
//           date: new Date().toISOString(),
//           notes: prescriptionData.notes,
//           diagnosis: prescriptionData.diagnosis,
//         })
//         .select()
//         .single();
//       if (presError) throw presError;
//       const medicationIds = await Promise.all(
//         prescriptionData.medications.map(async med => {
//           const { data, error } = await supabase.from('medications').select('id').eq('name', med.name).single();
//           return data?.id;
//         })
//       );

//       const medicationsToInsert = prescriptionData.medications
//         .filter((_, index) => medicationIds[index])
//         .map((med, index) => ({
//           prescription_id: prescription.id,
//           medication_id: medicationIds[index],
//           dosage: med.dosage,
//           duration: med.duration,
//           instructions: med.instructions || '',
//         }));

//       const { data: savedMeds, error: medsError } = await supabase
//         .from('prescription_medications')
//         .insert(medicationsToInsert)
//         .select('*, medication:medications(*)');

//       if (medsError) throw medsError;

//       set({
//         currentPrescription: {
//           ...prescription,
//           medications: savedMeds,
//         },
//         selectedMedications: [],
//         loading: false,
//       });
//       await useDoctorDashboardStore.getState().fetchSelectedPatient(patientId);


//       return { ...prescription, medications: savedMeds };
//     } catch (error) {
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },

//   fetchPatientPrescriptions: async patientId => {
//     set({ loading: true });
//     try {
//       const { data, error } = await supabase
//         .from('visits')
//         .select(
//           `
//           id,
//           date,
//           prescriptions:prescriptions(
//             *,
//             prescription_medications(
//               *,
//               medication:medications(
//                 id, name
//               )
//             )
//           )
//         `
//         )
//         .eq('patient_id', patientId)
//         .order('date', { ascending: false });

//       if (error) throw error;

//       const prescriptions = data.flatMap(visit =>
//         (visit.prescriptions || []).map(pres => ({
//           ...pres,
//           visit_date: visit.date,
//           medications:
//             pres.prescription_medications?.map(pm => ({
//               ...pm,
//               ...pm.medication,
//             })) || [],
//         }))
//       );

//       prescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

//       set({ patientPrescriptions: prescriptions, loading: false });
//       return prescriptions;
//     } catch (error) {
//       set({ error: error.message, loading: false });
//       throw error;
//     }
//   },
// }));



import { create } from 'zustand';
import { supabase } from '../supaBase/booking';
import useDoctorDashboardStore from "../store/doctorDashboardStore";

export const usePrescriptionStore = create((set, get) => ({
  medications: [],
  medicationCategories: [],
  dosageOptions: ['مرة يومياً', 'مرتين يومياً', 'كل 8 ساعات', 'كل 12 ساعة', 'حسب الحاجة', 'قبل الأكل', 'بعد الأكل'],
  durationOptions: [
    'لمدة يوم واحد',
    'لمدة 3 أيام',
    'لمدة أسبوع',
    'لمدة 10 أيام',
    'لمدة أسبوعين',
    'لمدة شهر',
    'حسب التعليمات',
  ],
  selectedMedications: [],
  currentPrescription: null,
  patientPrescriptions: [],
  loading: false,
  error: null,
  realtimeChannel: null,

  // Initialize real-time subscriptions
  initRealtime: patientId => {
    // Clean up any existing channel
    if (get().realtimeChannel) {
      supabase.removeChannel(get().realtimeChannel);
    }

    // Get visits filter for the patient
    const getVisitsFilter = async () => {
      const { data } = await supabase.from('visits').select('id').eq('patient_id', patientId);
      return data?.map(v => v.id).join(',') || '';
    };

    // Get prescriptions filter for the patient
    const getPrescriptionsFilter = async () => {
      const { data } = await supabase.from('visits').select('prescriptions(id)').eq('patient_id', patientId);
      return data?.flatMap(v => v.prescriptions?.map(p => p.id)).join(',') || '';
    };

    // Setup real-time subscriptions
    const channel = supabase
      .channel('realtime_prescriptions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prescriptions',
          filter: `visit_id=in.(${getVisitsFilter()})`,
        },
        async () => {
          await get().fetchPatientPrescriptions(patientId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'prescription_medications',
          filter: `prescription_id=in.(${getPrescriptionsFilter()})`,
        },
        async () => {
          await get().fetchPatientPrescriptions(patientId);
        }
      )
      .subscribe();

    set({ realtimeChannel: channel });
  },

  // Clean up real-time subscriptions
  cleanupRealtime: () => {
    if (get().realtimeChannel) {
      supabase.removeChannel(get().realtimeChannel);
      set({ realtimeChannel: null });
    }
  },

  fetchMedicationData: async () => {
    set({ loading: true, error: null });
    try {
      const [medsResult, catsResult] = await Promise.all([
        supabase.from('medications').select('*'),
        supabase.from('drug_categories').select('*'),
      ]);

      set({
        medications: medsResult.data || [],
        medicationCategories: catsResult.data || [],
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addMedication: medication => {
    set(state => ({
      selectedMedications: [
        ...state.selectedMedications,
        {
          ...medication,
          id: Date.now() + Math.random(),
        },
      ],
    }));
  },

  removeMedication: id => {
    set(state => ({
      selectedMedications: state.selectedMedications.filter(med => med.id !== id),
    }));
  },

  savePrescription: async (patientId, visitId, prescriptionData) => {
    set({ loading: true });
    try {
      // إنشاء الروشتة بدون diagnosis (لأنه مش موجود في الجدول)
      const { data: prescription, error: presError } = await supabase
        .from('prescriptions')
        .insert({
          visit_id: visitId,
          date: new Date().toISOString(),
          notes: prescriptionData.notes
        })
        .select()
        .single();
        
      if (presError) throw presError;

      // الحصول على معرفات الأدوية
      const medicationIds = await Promise.all(
        prescriptionData.medications.map(async med => {
          const { data, error } = await supabase.from('medications').select('id').eq('name', med.name).single();
          if (error) {
            console.warn(`Medication not found: ${med.name}`);
            return null;
          }
          return data?.id;
        })
      );

      // تصفية الأدوية التي لها معرفات صحيحة
      const validMedications = prescriptionData.medications
        .map((med, index) => ({ med, medicationId: medicationIds[index] }))
        .filter(item => item.medicationId !== null);

      if (validMedications.length === 0) {
        throw new Error('لم يتم العثور على أي أدوية صحيحة');
      }

      // إدراج أدوية الروشتة
      const medicationsToInsert = validMedications.map(({ med, medicationId }) => ({
        prescription_id: prescription.id,
        medication_id: medicationId,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions || '',
      }));

      const { data: savedMeds, error: medsError } = await supabase
        .from('prescription_medications')
        .insert(medicationsToInsert)
        .select('*, medication:medications(*)');

      if (medsError) throw medsError;

      const finalPrescription = {
        ...prescription,
        medications: savedMeds,
      };

      set({
        currentPrescription: finalPrescription,
        selectedMedications: [],
        loading: false,
      });

      // تحديث بيانات المريض المحدد
      await useDoctorDashboardStore.getState().fetchSelectedPatient(patientId);

      return finalPrescription;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchPatientPrescriptions: async patientId => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('visits')
        .select(
          `
          id,
          date,
          notes,
          prescriptions:prescriptions(
            *,
            prescription_medications(
              *,
              medication:medications(
                id, name
              )
            )
          ),
          medical_records:medical_records(
            diagnosis,
            notes
          )
        `
        )
        .eq('patient_id', patientId)
        .order('date', { ascending: false });

      if (error) throw error;

      const prescriptions = data.flatMap(visit =>
        (visit.prescriptions || []).map(pres => ({
          ...pres,
          visit_date: visit.date,
          visit_notes: visit.notes,
          // الحصول على التشخيص من medical_records
          diagnosis: visit.medical_records?.[0]?.diagnosis || 'لا يوجد تشخيص',
          medications:
            pres.prescription_medications?.map(pm => ({
              ...pm,
              ...pm.medication,
            })) || [],
        }))
      );

      prescriptions.sort((a, b) => new Date(b.date) - new Date(a.date));

      set({ patientPrescriptions: prescriptions, loading: false });
      return prescriptions;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));