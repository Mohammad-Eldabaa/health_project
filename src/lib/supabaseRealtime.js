
import { supabase } from '../supaBase/booking';
import useDoctorDashboardStore from '../store/doctorDashboardStore';

export const setupRealtimePatients = () => {
    const { setPatients, setAppointments } = useDoctorDashboardStore.getState();

    const channel = supabase
        .channel('realtime:clinic')
        // --- patients ---
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'patients',
            },
            payload => {
                console.log('🔁 Realtime [patients]:', payload);
                const { eventType, new: newPatient, old: oldPatient } = payload;
                const current = useDoctorDashboardStore.getState().patients || [];

                if (eventType === 'INSERT') {
                    setPatients([...current, newPatient]);
                } else if (eventType === 'UPDATE') {
                    const updated = current.map(p => (p.id === newPatient.id ? newPatient : p));
                    setPatients(updated);
                } else if (eventType === 'DELETE') {
                    const filtered = current.filter(p => p.id !== oldPatient.id);
                    setPatients(filtered);
                }
            }
        )

        // --- appointments ---
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'appointments',
            },
            payload => {
                console.log('🔁 Realtime [appointments]:', payload);
                const { eventType, new: newApp, old: oldApp } = payload;
                const current = useDoctorDashboardStore.getState().appointments || [];

                if (eventType === 'INSERT') {
                    setAppointments([...current, newApp]);
                } else if (eventType === 'UPDATE') {
                    const updated = current.map(a => (a.id === newApp.id ? newApp : a));
                    setAppointments(updated);
                } else if (eventType === 'DELETE') {
                    const filtered = current.filter(a => a.id !== oldApp.id);
                    setAppointments(filtered);
                }
            }
        )

        .subscribe();

    return channel;
};




// import { supabase } from '../supaBase/booking';
// import useDoctorDashboardStore from '../store/doctorDashboardStore';

// export const setupRealtimePatients = () => {
//     const { setPatients, setAppointments } = useDoctorDashboardStore.getState();

//     const channel = supabase
//         .channel('realtime:clinic')
//         // --- patients ---
//         .on(
//             'postgres_changes',
//             {
//                 event: '*',
//                 schema: 'public',
//                 table: 'patients',
//             },
//             payload => {
//                 console.log('🔁 Realtime [patients]:', payload);
//                 const { eventType, new: newPatient, old: oldPatient } = payload;
//                 const current = useDoctorDashboardStore.getState().patients || [];

//                 if (eventType === 'INSERT') {
//                     setPatients([...current, newPatient]);
//                 } else if (eventType === 'UPDATE') {
//                     const updated = current.map(p => (p.id === newPatient.id ? newPatient : p));
//                     setPatients(updated);
//                 } else if (eventType === 'DELETE') {
//                     const filtered = current.filter(p => p.id !== oldPatient.id);
//                     setPatients(filtered);
//                 }
//             }
//         )

//         // --- appointments ---
//         .on(
//             'postgres_changes',
//             {
//                 event: '*',
//                 schema: 'public',
//                 table: 'appointments',
//             },
//             payload => {
//                 console.log('🔁 Realtime [appointments]:', payload);
//                 const { eventType, new: newApp, old: oldApp } = payload;
//                 const current = useDoctorDashboardStore.getState().appointments || [];

//                 if (eventType === 'INSERT') {
//                     setAppointments([...current, newApp]);
//                 } else if (eventType === 'UPDATE') {
//                     const updated = current.map(a => (a.id === newApp.id ? newApp : a));
//                     setAppointments(updated);
//                 } else if (eventType === 'DELETE') {
//                     const filtered = current.filter(a => a.id !== oldApp.id);
//                     setAppointments(filtered);
//                 }
//             }
//         )

//         // --- visits ---
//         .on(
//             'postgres_changes',
//             {
//                 event: '*',
//                 schema: 'public',
//                 table: 'visits',
//             },
//             payload => {
//                 console.log('🔁 Realtime [visits]:', payload);
//                 // هنا حسب ما تحتاج: ممكن تحدث store أو تعمل refetch كامل
//             }
//         )

//         // --- prescriptions ---
//         .on(
//             'postgres_changes',
//             {
//                 event: '*',
//                 schema: 'public',
//                 table: 'prescriptions',
//             },
//             payload => {
//                 console.log('🔁 Realtime [prescriptions]:', payload);
//                 // نفس الفكرة
//             }
//         )

//         // --- prescription_medications ---
//         .on(
//             'postgres_changes',
//             {
//                 event: '*',
//                 schema: 'public',
//                 table: 'prescription_medications',
//             },
//             payload => {
//                 console.log('🔁 Realtime [prescription_medications]:', payload);
//                 // حسب الحاجة
//             }
//         )




//          .on(
//       'postgres_changes',
//       {
//         event: '*',
//         schema: 'public',
//         table: 'visits',
//       },
//       payload => {
//         console.log('🔁 Realtime [visits]:', payload);
//         const { eventType, new: newVisit, old: oldVisit } = payload;
//         const current = useDoctorDashboardStore.getState().visits || [];
//         const { setVisits } = useDoctorDashboardStore.getState();

//         if (eventType === 'INSERT') {
//           setVisits([...current, newVisit]);
//         } else if (eventType === 'UPDATE') {
//           const updated = current.map(v => (v.id === newVisit.id ? newVisit : v));
//           setVisits(updated);
//         } else if (eventType === 'DELETE') {
//           const filtered = current.filter(v => v.id !== oldVisit.id);
//           setVisits(filtered);
//         }
//       }
//     )

//         .subscribe();

//     return channel;
// };







// // import { supabase } from '../supaBase/booking';
// // import useDoctorDashboardStore from '../store/doctorDashboardStore';

// // export const setupRealtimePatients = () => {
// //   const { setPatients, setAppointments } = useDoctorDashboardStore.getState();

// //   const channel = supabase
// //     .channel('realtime:clinic')

// //     // --- patients ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, payload => {
// //       console.log('🔁 Realtime [patients]:', payload);
// //       const { eventType, new: newPatient, old: oldPatient } = payload;
// //       const current = useDoctorDashboardStore.getState().patients || [];

// //       if (eventType === 'INSERT') {
// //         setPatients([...current, newPatient]);
// //       } else if (eventType === 'UPDATE') {
// //         const updated = current.map(p => (p.id === newPatient.id ? newPatient : p));
// //         setPatients(updated);
// //       } else if (eventType === 'DELETE') {
// //         const filtered = current.filter(p => p.id !== oldPatient.id);
// //         setPatients(filtered);
// //       }
// //     })

// //     // --- appointments ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, payload => {
// //       console.log('🔁 Realtime [appointments]:', payload);
// //       const { eventType, new: newApp, old: oldApp } = payload;
// //       const current = useDoctorDashboardStore.getState().appointments || [];

// //       if (eventType === 'INSERT') {
// //         setAppointments([...current, newApp]);
// //       } else if (eventType === 'UPDATE') {
// //         const updated = current.map(a => (a.id === newApp.id ? newApp : a));
// //         setAppointments(updated);
// //       } else if (eventType === 'DELETE') {
// //         const filtered = current.filter(a => a.id !== oldApp.id);
// //         setAppointments(filtered);
// //       }
// //     })

// //     // --- visits ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'visits' }, payload => {
// //       console.log('🔁 Realtime [visits]:', payload);
// //       // TODO: add visit update logic if needed
// //     })

// //     // --- prescriptions ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'prescriptions' }, payload => {
// //       console.log('🔁 Realtime [prescriptions]:', payload);
// //       // TODO: handle prescription updates if needed
// //     })

// //     // --- prescription_medications ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'prescription_medications' }, payload => {
// //       console.log('🔁 Realtime [prescription_medications]:', payload);
// //       // TODO: handle updates
// //     })

// //     // --- test_requests ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'test_requests' }, payload => {
// //       console.log('🔁 Realtime [test_requests]:', payload);
// //       // TODO: handle updates
// //     })

// //     // --- tests ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'tests' }, payload => {
// //       console.log('🔁 Realtime [tests]:', payload);
// //       // TODO: handle updates
// //     })

// //     // --- medications ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'medications' }, payload => {
// //       console.log('🔁 Realtime [medications]:', payload);
// //       // TODO: update medications in store or refetch
// //     })

// //     // --- drug_categories ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'drug_categories' }, payload => {
// //       console.log('🔁 Realtime [drug_categories]:', payload);
// //       // TODO: update categories if needed
// //     })

// //     // --- medical_records ---
// //     .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_records' }, payload => {
// //       console.log('🔁 Realtime [medical_records]:', payload);
// //       // TODO: update or refetch medical records
// //     })

// //     // ----visites--------
// //     .on.on(
// //       'postgres_changes',
// //       {
// //         event: '*',
// //         schema: 'public',
// //         table: 'visits',
// //       },
// //       payload => {
// //         console.log('🔁 Realtime [visits]:', payload);
// //         const { eventType, new: newVisit, old: oldVisit } = payload;
// //         const current = useDoctorDashboardStore.getState().visits || [];
// //         const { setVisits } = useDoctorDashboardStore.getState();

// //         if (eventType === 'INSERT') {
// //           setVisits([...current, newVisit]);
// //         } else if (eventType === 'UPDATE') {
// //           const updated = current.map(v => (v.id === newVisit.id ? newVisit : v));
// //           setVisits(updated);
// //         } else if (eventType === 'DELETE') {
// //           const filtered = current.filter(v => v.id !== oldVisit.id);
// //           setVisits(filtered);
// //         }
// //       }
// //     )

// //     .subscribe();

// //   return channel;
// // };
