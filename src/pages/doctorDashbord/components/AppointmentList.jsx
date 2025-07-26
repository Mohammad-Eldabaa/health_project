import React from "react";

export function AppointmentList({ appointments }) {
    const startVisit = (appointment) => {
        const data = JSON.parse(localStorage.getItem("doctorDashboardData"));

        data.currentVisit = {
            appointmentId: appointment.id,
            patientId: appointment.patientId,
            startTime: new Date().toISOString(),
        };

        // تحديث حالة الموعد
        const apptIndex = data.appointments.findIndex((a) => a.id === appointment.id);
        if (apptIndex !== -1) {
            data.appointments[apptIndex].status = "قيد الكشف";
        }

        localStorage.setItem("doctorDashboardData", JSON.stringify(data));
        window.location.reload(); // يفضل تغييره بـ useState في وقت لاحق
    };

    const endVisit = (appointment) => {
        const data = JSON.parse(localStorage.getItem("doctorDashboardData"));

        const apptIndex = data.appointments.findIndex((a) => a.id === appointment.id);
        if (apptIndex !== -1) {
            data.appointments[apptIndex].status = "تم";
        }

        data.currentVisit = null;

        localStorage.setItem("doctorDashboardData", JSON.stringify(data));
        window.location.reload();
    };

    return (
        <div className="space-y-4">
            {appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 space-x-reverse">
                            <div>
                                <h4 className="font-bold text-gray-800">{appointment.patient}</h4>
                                <p className="text-gray-500 text-sm mt-1">{appointment.reason}</p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <span>
                                        {appointment.time} - {appointment.duration} دقيقة
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "مؤكد"
                                    ? "bg-green-100 text-green-800"
                                    : appointment.status === "ملغى"
                                        ? "bg-red-100 text-red-800"
                                        : appointment.status === "قيد الكشف"
                                            ? "bg-yellow-200 text-yellow-900"
                                            : appointment.status === "تم"
                                                ? "bg-gray-200 text-gray-800"
                                                : "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {appointment.status}
                        </span>
                    </div>

                    <div className="flex space-x-2 space-x-reverse mt-4">
                        <button className="text-sm text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1">
                            الملف الطبي
                        </button>

                        {appointment.status === "مؤكد" && (
                            <button
                                className="text-sm text-blue-600 px-3 py-1 rounded-2xl bg-green-100 hover:bg-green-300 transition flex items-center gap-1 mx-1"
                                onClick={() => startVisit(appointment)}
                            >
                                بدء الكشف
                            </button>
                        )}

                        {appointment.status === "قيد الكشف" && (
                            <button
                                className="text-sm text-white px-3 py-1 rounded-2xl bg-red-500 hover:bg-red-600 transition flex items-center gap-1 mx-1"
                                onClick={() => endVisit(appointment)}
                            >
                                إنهاء الكشف
                            </button>
                        )}

                        <button className="text-sm text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1">
                            تعديل
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
