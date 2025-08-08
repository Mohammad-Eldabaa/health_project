import React, { useEffect, useState } from 'react';
import PatientMedicalRecord from './PatientMedicalRecord';
import { fetchPatientMedicalRecord } from '../Services/patientService';

function PatientRecordContainer({ patientId }) {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!patientId) return;

        setLoading(true);
        fetchPatientMedicalRecord(patientId)
            .then(data => {
                setPatientData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'خطأ في تحميل بيانات المريض');
                setLoading(false);
            });
    }, [patientId]);

    if (loading) return <p>جاري التحميل...</p>;
    if (error) return <p className="text-red-600">خطأ: {error}</p>;
    if (!patientData) return <p>يرجى اختيار مريض</p>;

    // جمع الروشتات من جميع الزيارات (flatten)
    const prescriptions = patientData.visits?.flatMap(v => v.prescriptions) || [];

    // التحاليل من test_requests مرتبطة بالـ tests
    const tests = patientData.test_requests?.map(tr => ({
        date: tr.created_at?.split('T')[0] || '',
        type: tr.test?.name || '',
        result: tr.result || '',
    })) || [];

    return (
        <PatientMedicalRecord
            patient={patientData}
            records={{
                visits: patientData.visits || [],
                prescriptions,
                tests,
                notes: patientData.notes || '',
            }}
        />
    );
}

export default PatientRecordContainer;
