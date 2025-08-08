
// // lib/supabaseRealtime.js - Updated Version
// import { supabase } from '../supaBase/booking';
// import useDoctorDashboardStore from '../store/doctorDashboardStore';
// import { usePrescriptionStore } from '../store/prescriptionStore';

// const activeChannels = new Map();

// const handleTableUpdate = (tableName, currentData, payload, setter) => {
//     const { eventType, new: newItem, old: oldItem } = payload;
//     const { selectedPatient, refreshSelectedPatient } = useDoctorDashboardStore.getState();

//     console.log(`🔁 Realtime [${tableName}]:`, payload);

//     let updatedData = [...(currentData || [])];

//     switch (eventType) {
//         case 'INSERT':
//             // تجنب الإدراج المكرر
//             if (!updatedData.find(item => item.id === newItem.id)) {
//                 updatedData.push(newItem);
//             }
//             break;
//         case 'UPDATE':
//             updatedData = updatedData.map(item => 
//                 item.id === newItem.id ? { ...item, ...newItem } : item
//             );
//             break;
//         case 'DELETE':
//             updatedData = updatedData.filter(item => item.id !== oldItem.id);
//             break;
//         default:
//             break;
//     }

//     setter(updatedData);
// };

// // دالة محسنة لإعداد realtime للمرضى
// export const setupRealtimePatients = (patientId = null) => {
//     const channelName = patientId 
//         ? `clinic-patient-${patientId}`
//         : `clinic-global-${Math.random().toString(36).substr(2, 9)}`;

//     // إذا كانت القناة موجودة بالفعل، نعيدها
//     if (activeChannels.has(channelName)) {
//         return activeChannels.get(channelName);
//     }

//     const {
//         setPatients,
//         setAppointments,
//         setVisits,
//         setPrescriptions,
//         setPrescriptionMedications,
//         setTests,
//         setTestRequests,
//         setDrugCategories,
//         fetchData
//     } = useDoctorDashboardStore.getState();

//     const { fetchPatientPrescriptions } = usePrescriptionStore.getState();

//     const channel = supabase.channel(channelName);

//     // --- patients ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'patients',
//             ...(patientId && { filter: `id=eq.${patientId}` }),
//         },
//         async (payload) => {
//             console.log('🔁 Patients update:', payload);
            
//             // إعادة جلب البيانات الكاملة للمرضى مع العلاقات
//             await fetchData();
            
//             // إشعار المكونات بالتحديث
//             if (window.onPatientsUpdate) {
//                 window.onPatientsUpdate(payload);
//             }
//         }
//     );

//     // --- visits ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'visits',
//             ...(patientId && { filter: `patient_id=eq.${patientId}` }),
//         },
//         async (payload) => {
//             console.log(' Visits update:', payload);
            
//             // إعادة جلب البيانات الكاملة
//               if (selectedPatient?.id === payload.new?.patient_id) {
//       await refreshSelectedPatient();
//     }
//             // إشعار المكونات بالتحديث
//             if (window.onVisitsUpdate) {
//                 window.onVisitsUpdate(payload);
//             }
//         }
//     );

//     // --- prescriptions ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'prescriptions',
//             ...(patientId && { filter: `patient_id=eq.${patientId}` }),
//         },
//         async (payload) => {
//             console.log('🔁 Prescriptions update:', payload);
            
//             // إعادة جلب البيانات الكاملة
//             await fetchData();
            
//             // جلب روشتات المريض إذا كان محدد
//             const { new: newPrescription } = payload;
//             if (newPrescription?.patient_id) {
//                 await fetchPatientPrescriptions(newPrescription.patient_id);
//             }
            
//             // إشعار المكونات بالتحديث
//             if (window.onPrescriptionsUpdate) {
//                 window.onPrescriptionsUpdate(payload);
//             }
//         }
//     );

//     // --- prescription_medications ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'prescription_medications',
//         },
//         async (payload) => {
//             console.log('🔁 Prescription medications update:', payload);
            
//             // إعادة جلب البيانات الكاملة
//             await fetchData();
            
//             // إشعار المكونات بالتحديث
//             if (window.onPrescriptionMedicationsUpdate) {
//                 window.onPrescriptionMedicationsUpdate(payload);
//             }
//         }
//     );

//     // --- test_requests ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'test_requests',
//             ...(patientId && { filter: `patient_id=eq.${patientId}` }),
//         },
//         async (payload) => {
//             console.log('🔁 Test requests update:', payload);
            
//             // إعادة جلب البيانات الكاملة
//             await fetchData();
            
//             // إشعار المكونات بالتحديث
//             if (window.onTestRequestsUpdate) {
//                 window.onTestRequestsUpdate(payload);
//             }
//         }
//     );

//     // --- appointments ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'appointments',
//             ...(patientId && { filter: `patient_id=eq.${patientId}` }),
//         },
//         async (payload) => {
//             console.log('🔁 Appointments update:', payload);
            
//             const current = useDoctorDashboardStore.getState().appointments || [];
//             handleTableUpdate('appointments', current, payload, setAppointments);
//         }
//     );

//     // --- tests ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'tests',
//         },
//         payload => {
//             const current = useDoctorDashboardStore.getState().tests || [];
//             handleTableUpdate('tests', current, payload, setTests);
//         }
//     );

//     // --- drug_categories ---
//     channel.on(
//         'postgres_changes',
//         {
//             event: '*',
//             schema: 'public',
//             table: 'drug_categories',
//         },
//         payload => {
//             const current = useDoctorDashboardStore.getState().drug_categories || [];
//             handleTableUpdate('drug_categories', current, payload, setDrugCategories);
//         }
//     );

//     // الاشتراك مع معالجة الأخطاء
//     channel.subscribe((status, err) => {
//         if (err) {
//             console.error('Realtime subscription error:', err);
//             activeChannels.delete(channelName);
//         } else {
//             activeChannels.set(channelName, channel);
//             console.log(`✅ Realtime channel [${channelName}] status:`, status);
//         }
//     });

//     return channel;
// };

// // دالة محسنة لإزالة القناة
// export const removeRealtimeChannel = async (channel) => {
//     if (!channel) return;

//     try {
//         const channelName = channel.topic.replace('realtime:', '');
//         const { error } = await supabase.removeChannel(channel);
        
//         if (error) {
//             console.error('Error removing channel:', error);
//         } else {  
//             activeChannels.delete(channelName);
//             console.log('✅ Channel removed successfully:', channelName);
//         }
//     } catch (err) {
//         console.error('Exception while removing channel:', err);
//     }
// };

// // دالة للحصول على جميع القنوات النشطة
// export const getActiveChannels = () => {
//     return Array.from(activeChannels.keys());
// };

// // دالة لتنظيف جميع القنوات
// export const cleanupAllChannels = async () => {
//     const channels = Array.from(activeChannels.values());
    
//     for (const channel of channels) {
//         await removeRealtimeChannel(channel);
//     }
    
//     activeChannels.clear();
//     console.log('✅ All channels cleaned up');
// };



// lib/supabaseRealtime.js
import { supabase } from '../supaBase/booking';
import useDoctorDashboardStore from '../store/doctorDashboardStore';
import { usePrescriptionStore } from '../store/prescriptionStore';

const activeChannels = new Map();

const handleTableUpdate = (tableName, currentData, payload, setter) => {
    const { eventType, new: newItem, old: oldItem } = payload;
    console.log(`🔁 Realtime [${tableName}]:`, payload);

    let updatedData = [...(currentData || [])];

    switch (eventType) {
        case 'INSERT':
            if (!updatedData.find(item => item.id === newItem.id)) {
                updatedData.push(newItem);
            }
            break;
        case 'UPDATE':
            updatedData = updatedData.map(item =>
                item.id === newItem.id ? { ...item, ...newItem } : item
            );
            break;
        case 'DELETE':
            updatedData = updatedData.filter(item => item.id !== oldItem.id);
            break;
        default:
            break;
    }

    if (typeof setter === 'function') {
        setter(updatedData);
    } else {
        console.warn(`❗ Setter not defined for ${tableName}`);
    }
};

export const setupRealtimePatients = (patientId = null) => {
    const channelName = patientId
        ? `clinic-patient-${patientId}`
        : `clinic-global`; // ثابت لمنع التكرار

    if (activeChannels.has(channelName)) {
        return activeChannels.get(channelName);
    }

    const {
        setPatients,
        setAppointments,
        setVisits,
        setPrescriptions,
        setPrescriptionMedications,
        setTests,
        setTestRequests,
        setDrugCategories,
        fetchData,
        selectedPatient,
        refreshSelectedPatient
    } = useDoctorDashboardStore.getState();

    const { fetchPatientPrescriptions } = usePrescriptionStore.getState();

    const channel = supabase.channel(channelName);

    // --- patients ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'patients',
            ...(patientId && { filter: `id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Patients update:', payload);
            await fetchData();
            window.onPatientsUpdate?.(payload);
        }
    );

    // --- visits ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'visits',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Visits update:', payload);
            if (selectedPatient?.id === payload.new?.patient_id) {
                await refreshSelectedPatient();
            }
            window.onVisitsUpdate?.(payload);
        }
    );

    // --- prescriptions ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescriptions',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Prescriptions update:', payload);
            await fetchData();
            const { new: newPrescription } = payload;
            if (newPrescription?.patient_id) {
                await fetchPatientPrescriptions(newPrescription.patient_id);
            }
            window.onPrescriptionsUpdate?.(payload);
        }
    );

    // --- prescription_medications ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescription_medications',
        },
        async (payload) => {
            console.log('🔁 Prescription medications update:', payload);
            await fetchData();
            window.onPrescriptionMedicationsUpdate?.(payload);
        }
    );

    // --- test_requests ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'test_requests',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Test requests update:', payload);
            await fetchData();
            window.onTestRequestsUpdate?.(payload);
        }
    );

    // --- appointments ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'appointments',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async (payload) => {
            console.log('🔁 Appointments update:', payload);
            const current = useDoctorDashboardStore.getState().appointments || [];
            handleTableUpdate('appointments', current, payload, setAppointments);
        }
    );

    // --- tests ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'tests',
        },
        (payload) => {
            const current = useDoctorDashboardStore.getState().tests || [];
            handleTableUpdate('tests', current, payload, setTests);
        }
    );

    // --- drug_categories ---
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'drug_categories',
        },
        (payload) => {
            const current = useDoctorDashboardStore.getState().drug_categories || [];
            handleTableUpdate('drug_categories', current, payload, setDrugCategories);
        }
    );

    // الاشتراك مع التعامل مع الأخطاء
    channel.subscribe((status, err) => {
        if (err) {
            console.error('Realtime subscription error:', err);
            activeChannels.delete(channelName);
        } else {
            activeChannels.set(channelName, channel);
            console.log(`✅ Realtime channel [${channelName}] status:`, status);
        }
    });

    return channel;
};

export const removeRealtimeChannel = async (channel) => {
    if (!channel) return;

    try {
        const channelName = channel.topic.replace('realtime:', '');
        const { error } = await supabase.removeChannel(channel);

        if (error) {
            console.error('Error removing channel:', error);
        } else {
            activeChannels.delete(channelName);
            console.log('✅ Channel removed successfully:', channelName);
        }
    } catch (err) {
        console.error('Exception while removing channel:', err);
    }
};

export const getActiveChannels = () => {
    return Array.from(activeChannels.keys());
};

export const cleanupAllChannels = async () => {
    const channels = Array.from(activeChannels.values());
    for (const channel of channels) {
        await removeRealtimeChannel(channel);
    }
    activeChannels.clear();
    console.log('✅ All channels cleaned up');
};
