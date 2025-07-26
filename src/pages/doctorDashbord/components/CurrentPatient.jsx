
import React, { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

export function CurrentPatient() {
    const [patient, setPatient] = useState(null);
    const [appointment, setAppointment] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("doctorDashboardData"));
        if (data && data.currentVisit) {
            const visit = data.currentVisit;
            const foundPatient = data.patients.find(p => p.id === visit.patientId);
            const foundAppointment = data.appointments.find(a => a.id === visit.appointmentId);

            setPatient(foundPatient);
            setAppointment(foundAppointment);
        }
    }, []);

    if (!patient || !appointment) return <p className="text-gray-500">لا يوجد مريض حالياً</p>;

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">المريض الحالي</h3>
                <Stethoscope className="text-primary" />
            </div>

            <div className="bg-blue-100 rounded-lg p-2 mb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-800">{patient.name}</h4>
                        <p className="text-gray-500 text-sm">{patient.age} سنة</p>
                    </div>
                    <span className="bg-primary px-2 py-1 rounded text-sm">
                        {appointment.status}
                    </span>
                </div>
            </div>

            <button className="w-full bg-accent text-white py-2 rounded hover:bg-opacity-90 transition"
                style={{ backgroundColor: "var(--color-accent)" }}
            >
                فتح الملف الطبي الكامل
            </button>
        </>
    );
}
