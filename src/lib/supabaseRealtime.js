
import { supabase } from '../supaBase/booking';
import useDoctorDashboardStore from '../store/doctorDashboardStore';
import { usePrescriptionStore } from '../store/prescriptionStore';

const handleTableUpdate = (tableName, currentData, payload, setter) => {
    const { eventType, new: newItem, old: oldItem } = payload;
    console.log(`🔁 Realtime [${tableName}]:`, payload);

    switch (eventType) {
        case 'INSERT':
            setter([...currentData, newItem]);
            break;
        case 'UPDATE':
            setter(currentData.map(item => (item.id === newItem.id ? newItem : item)));
            break;
        case 'DELETE':
            setter(currentData.filter(item => item.id !== oldItem.id));
            break;
        default:
            break;
    }
};

export const setupRealtimePatients = (patientId = null) => {
    const {
        setPatients,
        setAppointments,
        setVisits,
        setPrescriptionMedications,
        setTests,
        setTestRequests,
        setDrugCategories,
    } = useDoctorDashboardStore.getState();

    const { fetchPatientPrescriptions } = usePrescriptionStore.getState();

    // إنشاء قناة مع اسم فريد
    const channelName = patientId
        ? `clinic-patient-${patientId}`
        : `clinic-global-${Math.random().toString(36).substr(2, 9)}`;

    const channel = supabase.channel(channelName);

    // --- patients --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'patients',
            ...(patientId && { filter: `id=eq.${patientId}` }),
        },
        payload => {
            const current = useDoctorDashboardStore.getState().patients || [];
            handleTableUpdate('patients', current, payload, setPatients);
        }
    );

    // --- appointments --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'appointments',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        payload => {
            const current = useDoctorDashboardStore.getState().appointments || [];
            handleTableUpdate('appointments', current, payload, setAppointments);
        }
    );

    // --- visits --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'visits',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        payload => {
            const current = useDoctorDashboardStore.getState().visits || [];
            handleTableUpdate('visits', current, payload, setVisits);
        }
    );

    // --- prescriptions --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescriptions',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        async payload => {
            console.log('🔁 Realtime [prescriptions]:', payload);
            const { new: newPrescription } = payload;
            if (newPrescription?.patient_id) {
                await fetchPatientPrescriptions(newPrescription.patient_id);
            }
        }
    );

    // --- prescription_medications --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'prescription_medications',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().prescription_medications || [];
            handleTableUpdate('prescription_medications', current, payload, setPrescriptionMedications);
        }
    );

    // --- tests --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'tests',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().tests || [];
            handleTableUpdate('tests', current, payload, setTests);
        }
    );

    // --- test_requests --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'test_requests',
            ...(patientId && { filter: `patient_id=eq.${patientId}` }),
        },
        payload => {
            const current = useDoctorDashboardStore.getState().test_requests || [];
            handleTableUpdate('test_requests', current, payload, setTestRequests);
        }
    );

    // داخل دالة setupRealtimePatients
channel
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'tests',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().tests;
            handleTableUpdate('tests', current, payload, useDoctorDashboardStore.getState().setTests);
        }
    )
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'test_cat',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().test_categories;
            handleTableUpdate('test_categories', current, payload, useDoctorDashboardStore.getState().setTestCategories);
        }
    )
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'test_requests',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().test_requests;
            handleTableUpdate('test_requests', current, payload, useDoctorDashboardStore.getState().setTestRequests);
        }
    );

    // --- drug_categories --- (محدثة)
    channel.on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
            table: 'drug_categories',
        },
        payload => {
            const current = useDoctorDashboardStore.getState().drug_categories || [];
            handleTableUpdate('drug_categories', current, payload, setDrugCategories);
        }
    );

    // الاشتراك مع معالجة الأخطاء
    channel.subscribe((status, err) => {
        if (err) {
            console.error('Realtime subscription error:', err);
        }
        console.log(`Realtime channel [${channelName}] status:`, status);
    });

    return channel;
};

// دالة مساعدة لإزالة القناة
export const removeRealtimeChannel = async channel => {
    if (channel) {
        try {
            const { error } = await supabase.removeChannel(channel);
            if (error) {
                console.error('Error removing channel:', error);
            } else {
                console.log('Channel removed successfully');
            }
        } catch (err) {
            console.error('Exception while removing channel:', err);
        }
    }
};
