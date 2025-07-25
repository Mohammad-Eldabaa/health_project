import React from "react";
export function AppointmentList({
    appointments
}) {
    return <div className="space-y-4">
        {appointments.map(appointment => <div key={appointment.id} className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start ">
                <div className="flex items-start space-x-3 space-x-reverse">
                    <div>
                        <h4 className="font-bold text-gray-800">
                            {appointment.patient}
                        </h4>
                        <p className="text-gray-500 text-sm mt-1">
                            {appointment.reason}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">

                            <span>
                                {appointment.time} - {appointment.duration} دقيقة
                            </span>
                        </div>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "مؤكد" ? "bg-green-100 text-green-800" : appointment.status === "ملغى" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {appointment.status}
                </span>
            </div>

            <div className="flex space-x-2 space-x-reverse mt-4">
                <button className="text-sm  text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1">

                    الملف الطبي
                </button>
                <button className="text-sm  text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1
                                        ">

                    بدء الكشف
                </button>
                <button className="text-sm  text-blue-600 px-3 py-1 rounded-2xl bg-cyan-100 hover:bg-cyan-300 transition flex items-center gap-1 mx-1">

                    تعديل
                </button>
            </div>
        </div>)}
    </div>;
}
