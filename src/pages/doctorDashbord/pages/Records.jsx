


// Records.jsx (الملف الرئيسي المحدث)
import { useState, useEffect } from 'react';
import PrescriptionSheet from "../components/PrescriptionSheet";
import PrescriptionModel from "../pages/PrescriptionModel";
import PatientSearch from "../components/recordes/PatientSearch";
import PatientInfo from "../components/recordes/PatientInfo";
import VisitsHistory from "../components/recordes/VisitsHistory";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { setupRealtimePatients } from "../../../lib/supabaseRealtime";
import usePatientStore from "../../../store/patientStore";

export default function Records() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    const { selectedPatientName } = usePatientStore();
    const {
        loading,
        error,
        patients,
        doctors,
        fetchData,
        setPatients,
        setVisits,
        setPrescriptions
    } = useDoctorDashboardStore();

    // Setup realtime updates
    useEffect(() => {
    if (!patients.length || !doctors.length) {
        fetchData(); // هنجلب البيانات فقط لو مش موجودة
    }

        // إعداد الـ realtime للمرضى العامة
        const channel = setupRealtimePatients();

        // إضافة مستمع خاص للتحديثات
        channel.on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
            console.log('Realtime update:', payload);

            // التعامل مع تحديثات الجداول المختلفة
            switch (payload.table) {
                case 'patients':
                    handlePatientsUpdate(payload);
                    break;
                case 'visits':
                    handleVisitsUpdate(payload);
                    break;
                case 'prescriptions':
                    handlePrescriptionsUpdate(payload);
                    break;
                case 'prescription_medications':
                    handlePrescriptionMedicationsUpdate(payload);
                    break;
                case 'test_requests':
                    handleTestRequestsUpdate(payload);
                    break;
                default:
                    // إعادة جلب البيانات للتحديثات الأخرى
                    fetchData();
                    break;
            }
        });

        return () => {
            channel.unsubscribe();
        };
    }, []);

    // التعامل مع تحديثات المرضى
    const handlePatientsUpdate = (payload) => {
        const { eventType, new: newItem, old: oldItem } = payload;
        const currentPatients = useDoctorDashboardStore.getState().patients;

        let updatedPatients = [...currentPatients];

        switch (eventType) {
            case 'INSERT':
                updatedPatients.push(newItem);
                break;
            case 'UPDATE':
                updatedPatients = updatedPatients.map(p => p.id === newItem.id ? newItem : p);
                // تحديث المريض المحدد إذا كان نفس المريض
                if (selectedPatient?.id === newItem.id) {
                    setSelectedPatient(prev => ({
                        ...prev,
                        ...newItem,
                        visits: prev.visits // الحفاظ على الزيارات
                    }));
                }
                break;
            case 'DELETE':
                updatedPatients = updatedPatients.filter(p => p.id !== oldItem.id);
                // إلغاء تحديد المريض إذا تم حذفه
                if (selectedPatient?.id === oldItem.id) {
                    setSelectedPatient(null);
                }
                break;
        }

        setPatients(updatedPatients);
    };

    // التعامل مع تحديثات الزيارات
    const handleVisitsUpdate = async (payload) => {
        const { eventType, new: newItem } = payload;

        // إعادة جلب بيانات المريض إذا كانت الزيارة متعلقة به
        if (selectedPatient && newItem?.patient_id === selectedPatient.id) {
            await refreshSelectedPatient();
        }
    };

    // التعامل مع تحديثات الروشتات
    const handlePrescriptionsUpdate = async (payload) => {
        const { eventType, new: newItem } = payload;

        // إعادة جلب بيانات المريض إذا كانت الروشتة متعلقة به
        if (selectedPatient) {
            await refreshSelectedPatient();
        }
    };

    // التعامل مع تحديثات أدوية الروشتات
    const handlePrescriptionMedicationsUpdate = async (payload) => {
        if (selectedPatient) {
            await refreshSelectedPatient();
        }
    };

    // التعامل مع تحديثات طلبات التحاليل
    const handleTestRequestsUpdate = async (payload) => {
        const { eventType, new: newItem } = payload;

        if (selectedPatient && newItem?.patient_id === selectedPatient.id) {
            await refreshSelectedPatient();
        }
    };

    // دالة لتحديث بيانات المريض المحدد
    const refreshSelectedPatient = async () => {
        if (!selectedPatient?.id) return;

        // await fetchData();
        const updatedPatients = useDoctorDashboardStore.getState().patients;
        const updatedPatient = updatedPatients.find(p => p.id === selectedPatient.id);

        if (updatedPatient) {
            setSelectedPatient({
                ...updatedPatient,
                visits: updatedPatient.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
            });
        }
    };

    // Handle selected patient from store
    useEffect(() => {
        if (selectedPatientName && patients.length > 0) {
            let targetPatient = null;

            if (typeof selectedPatientName === 'object' && selectedPatientName.id) {
                targetPatient = patients.find(p => p.id === selectedPatientName.id);
            } else if (typeof selectedPatientName === 'string') {
                targetPatient = patients.find(p =>
                    p.fullName?.toLowerCase() === selectedPatientName.toLowerCase()
                ); // ← هذا القوس كان ناقص
            }

            if (targetPatient) {
                setSelectedPatient({
                    ...targetPatient,
                    visits: targetPatient.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
                });
            }
        }
    }, [patients, selectedPatientName]);

    const handlePatientSelect = (patient) => {
        const patientWithSortedVisits = {
            ...patient,
            visits: patient.visits?.sort((a, b) => new Date(b.date) - new Date(a.date)) || []
        };
        setSelectedPatient(patientWithSortedVisits);
    };

    const handleNewPrescription = () => {
        setIsPrescriptionOpen(true);
    };

    const handleViewPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setIsViewModalOpen(true);
    };

    const handlePrescriptionClose = async (shouldRefresh = false) => {
        setIsPrescriptionOpen(false);
        if (shouldRefresh && selectedPatient?.id) {
            await refreshSelectedPatient();
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-white min-h-screen">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    <p>حدث خطأ في تحميل البيانات:</p>
                    <p>{error.message}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg">
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    // No data state
    if (!patients.length) {
        return <div className="p-4 text-red-600">لا توجد بيانات متاحة</div>;
    }

    return (
        <>
            {/* Modals */}
            <PrescriptionSheet
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                prescription={selectedPrescription}
                Patient={selectedPatient}
                data={{ doctors }}
            />
            <PrescriptionModel
                isOpen={isPrescriptionOpen}
                onClose={handlePrescriptionClose}
                selectedPatient={selectedPatient}
            />

            {/* Main Content */}
            <div className="flex flex-col mx-2 sm:mx-4 lg:mx-6 my-3 px-4">
                {/* Header */}
                <div className="flex items-center gap-3 justify-between">
                    <span className="font-bold sm:text-lg lg:text-xl mb-5">سجل المريض</span>
                </div>

                {/* Search and New Prescription */}
                <PatientSearch
                    patients={patients}
                    onPatientSelect={handlePatientSelect}
                    onNewPrescription={handleNewPrescription}
                    selectedPatient={selectedPatient}
                />

                {/* Patient Information */}
                <PatientInfo patient={selectedPatient} />

                {/* Visits History */}
                <VisitsHistory
                    patient={selectedPatient}
                    onViewPrescription={handleViewPrescription}
                />
            </div>
        </>
    );
}
