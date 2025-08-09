
import React from "react";
import MedicationIcon from '@mui/icons-material/Medication';
import ScienceIcon from '@mui/icons-material/Science';
import NotesIcon from '@mui/icons-material/Notes';
import EventIcon from '@mui/icons-material/Event';

function PatientMedicalRecord({ patient = {}, records = {} }) {
    const [activeTab, setActiveTab] = React.useState("prescriptions");
    

    React.useEffect(() => {
        console.log("Patient data:", patient);
        console.log("Records data:", records);
    }, [patient, records]);

    const prescriptions = records.prescriptions || [];
    const tests = records.test_requests || records.tests || [];
    const appointments = records.appointments || [];

    const allPrescriptions = prescriptions.length > 0
        ? prescriptions
        : (records.visits?.flatMap(visit => visit.prescriptions || []) || []);

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
            
            {/* Header */}
            <header className="mb-8 bg-white rounded-xl shadow-lg p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-cyan-600 flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
                    {(patient.fullName?.[0] || patient.full_name?.[0] || patient.name?.[0]) || "م"}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-1">
                        {patient.fullName || patient.full_name || patient.name || "مريض غير معروف"}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                        <span className="bg-cyan-100 px-3 py-1 rounded-full font-medium">
                            العمر: {patient.age ?? "غير معروف"} سنة
                        </span>
                        <span className="bg-teal-100 px-3 py-1 rounded-full font-medium">
                            الجنس: {patient.gender || "غير معروف"}
                        </span>
                        <span className="bg-cyan-100 px-3 py-1 rounded-full font-medium">
                            الهاتف: {patient.phoneNumber || patient.phone || "غير مسجل"}
                        </span>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
                <div className="flex">
                    {[
                        { key: "prescriptions", label: "الروشتات", icon: <MedicationIcon fontSize="large" /> },
                        { key: "tests", label: "التحاليل", icon: <ScienceIcon fontSize="large" /> },
                        { key: "appointments", label: "المواعيد", icon: <EventIcon fontSize="large" /> },
                        { key: "notes", label: "الملاحظات", icon: <NotesIcon fontSize="large" /> },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-4 px-6 text-center transition-all duration-300 font-semibold ${activeTab === tab.key
                                ? "bg-cyan-600 text-white shadow-lg"
                                : "text-gray-600 hover:bg-gray-100 hover:text-cyan-600"
                                }`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xl">{tab.icon}</span>
                                <span>{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Content Area */}
            <section className="bg-white rounded-xl shadow-lg p-6 min-h-[24rem]">

                {activeTab === "prescriptions" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MedicationIcon fontSize="large" /> سجل الروشتات
                        </h3>
                        {allPrescriptions?.length ? (
                            <div className="space-y-6">
                                {allPrescriptions.map((presc, idx) => (
                                    <div key={presc.id || idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-cyan-600 text-white p-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-lg">روشتة رقم #{idx + 1}</h4>
                                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                                    {presc.date ? new Date(presc.date).toLocaleDateString("ar-EG") : "غير محدد"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            {presc.prescription_medications?.length ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-50">
                                                                <th className="border border-gray-300 p-3 text-center font-semibold">#</th>
                                                                <th className="border border-gray-300 p-3 text-center font-semibold">اسم الدواء</th>
                                                                <th className="border border-gray-300 p-3 text-center font-semibold">الجرعة</th>
                                                                <th className="border border-gray-300 p-3 text-center font-semibold">المدة</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {presc.prescription_medications.map((med, i) => (
                                                                <tr key={med.id || i} className="hover:bg-gray-50">
                                                                    <td className="border border-gray-300 p-3 text-center">{i + 1}</td>
                                                                    <td className="border border-gray-300 p-3 text-center font-medium">
                                                                        {med.medication?.name || med.name || "دواء غير محدد"}
                                                                    </td>
                                                                    <td className="border border-gray-300 p-3 text-center">{med.dosage || "غير محدد"}</td>
                                                                    <td className="border border-gray-300 p-3 text-center">{med.duration || "غير محدد"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">لا توجد أدوية في هذه الروشتة</p>
                                            )}

                                            {presc.notes && (
                                                <div className="mt-4 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                                                    <p className="text-gray-700">
                                                        <strong>ملاحظات:</strong> {presc.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 text-lg">لا توجد روشتات مسجلة <MedicationIcon fontSize="small" /></div>
                        )}
                    </>
                )}

                {activeTab === "tests" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <ScienceIcon fontSize="large" /> سجل التحاليل
                        </h3>
                        {tests?.length ? (
                            <div className="grid gap-4">
                                {tests.map((test, idx) => (
                                    <div
                                        key={test.id || idx}
                                        className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-teal-50 to-cyan-50"
                                    >
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">التاريخ</label>
                                                <p className="font-semibold text-gray-800">
                                                    {test.date || test.created_at ?
                                                        new Date(test.date || test.created_at).toLocaleDateString('ar-EG') :
                                                        "غير محدد"
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">نوع التحليل</label>
                                                <p className="font-semibold text-gray-800">
                                                    {test.test?.name || test.type || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">النتيجة</label>
                                                <p className="text-gray-700">{test.result || "في الانتظار"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 text-lg">لا توجد تحاليل مسجلة <ScienceIcon fontSize="large" /></div>
                        )}
                    </>
                )}

                {activeTab === "appointments" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <EventIcon fontSize="large" /> مواعيد الحجز
                        </h3>
                        {appointments?.length ? (
                            <div className="space-y-4">
                                {appointments.map((appt, idx) => (
                                    <div key={appt.id || idx} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gradient-to-r from-cyan-50 to-teal-50">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">التاريخ</label>
                                                <p className="font-semibold text-gray-800">
                                                    {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">الوقت</label>
                                                <p className="font-semibold text-gray-800">{appt.time || "غير محدد"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">الحالة</label>
                                                <p className={`font-semibold ${appt.status === 'تم' ? 'text-green-600' :
                                                        appt.status === 'ملغي' ? 'text-red-600' :
                                                            appt.status === 'في الإنتظار' ? 'text-yellow-600 ' :
                                                                'text-gray-800'
                                                    }`}>
                                                    {appt.status === 'confirmed' ? 'مؤكد' :
                                                        appt.status === 'cancelled' ? 'ملغي' :
                                                            appt.status === 'pending' ? 'في الانتظار' :
                                                                appt.status || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">ملاحطات</label>
                                                <p className="text-gray-700">{appt.reason || "لا يوجد ملاحظات"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 text-lg">
                                لا توجد مواعيد حجز <EventIcon fontSize="small" />
                            </div>
                        )}
                    </>
                )}

                {activeTab === "notes" && (
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <NotesIcon fontSize="large" /> الملاحظات العامة
                        </h3>
                        {records.notes ? (
                            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-lg border border-cyan-200">
                                <p className="text-gray-700 leading-relaxed text-lg">{records.notes}</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 text-lg">لا توجد ملاحظات <NotesIcon fontSize="large" /></div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default PatientMedicalRecord;