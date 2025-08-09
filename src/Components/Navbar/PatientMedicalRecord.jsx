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
        <div className="max-full mx-auto p-6 bg-[#f5f5f5] min-h-screen">
            
            {/* Header */}
            <header className="mb-8 bg-white rounded-xl shadow-lg p-6 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-4xl font-extrabold shadow-lg">
                    {(patient.fullName?.[0] || patient.full_name?.[0] || patient.name?.[0]) || "م"}
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1">
                        {patient.fullName || patient.full_name || patient.name || "مريض غير معروف"}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-[var(--color-text-secondary)]">
                        <span className="bg-[var(--color-primary-light)] px-3 py-1 rounded-full font-medium">
                            العمر: {patient.age ?? "غير معروف"} سنة
                        </span>
                        <span className="bg-[#e0f2f1] px-3 py-1 rounded-full font-medium">
                            الجنس: {patient.gender || "غير معروف"}
                        </span>
                        <span className="bg-[var(--color-primary-light)] px-3 py-1 rounded-full font-medium">
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
                                ? "bg-[var(--color-primary)] text-white shadow-lg"
                                : "text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-primary)]"
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
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                            <MedicationIcon fontSize="large" /> سجل الروشتات
                        </h3>
                        {allPrescriptions?.length ? (
                            <div className="space-y-6">
                                {allPrescriptions.map((presc, idx) => (
                                    <div key={presc.id || idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                        <div className="bg-[var(--color-primary)] text-white p-4">
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
                                                <p className="text-[var(--color-text-secondary)] text-center py-4">لا توجد أدوية في هذه الروشتة</p>
                                            )}

                                            {presc.notes && (
                                                <div className="mt-4 p-3 bg-[var(--color-primary-light)] border border-[var(--color-primary)] rounded-lg">
                                                    <p className="text-[var(--color-text-primary)]">
                                                        <strong>ملاحظات:</strong> {presc.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[var(--color-text-secondary)] text-lg">لا توجد روشتات مسجلة <MedicationIcon fontSize="small" /></div>
                        )}
                    </>
                )}

                {activeTab === "tests" && (
                    <>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                            <ScienceIcon fontSize="large" /> سجل التحاليل
                        </h3>
                        {tests?.length ? (
                            <div className="grid gap-4">
                                {tests.map((test, idx) => (
                                    <div
                                        key={test.id || idx}
                                        className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-[#e0f2f1] to-[var(--color-primary-light)]"
                                    >
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">التاريخ</label>
                                                <p className="font-semibold text-[var(--color-text-primary)]">
                                                    {test.date || test.created_at ?
                                                        new Date(test.date || test.created_at).toLocaleDateString('ar-EG') :
                                                        "غير محدد"
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">نوع التحليل</label>
                                                <p className="font-semibold text-[var(--color-text-primary)]">
                                                    {test.test?.name || test.type || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">النتيجة</label>
                                                <p className="text-[var(--color-text-primary)]">{test.result || "في الانتظار"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[var(--color-text-secondary)] text-lg">لا توجد تحاليل مسجلة <ScienceIcon fontSize="large" /></div>
                        )}
                    </>
                )}

                {activeTab === "appointments" && (
                    <>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                            <EventIcon fontSize="large" /> مواعيد الحجز
                        </h3>
                        {appointments?.length ? (
                            <div className="space-y-4">
                                {appointments.map((appt, idx) => (
                                    <div key={appt.id || idx} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gradient-to-r from-[var(--color-primary-light)] to-[#e0f2f1]">
                                        <div className="grid md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">التاريخ</label>
                                                <p className="font-semibold text-[var(--color-text-primary)]">
                                                    {appt.date ? new Date(appt.date).toLocaleDateString('ar-EG') : "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">الوقت</label>
                                                <p className="font-semibold text-[var(--color-text-primary)]">{appt.time || "غير محدد"}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">الحالة</label>
                                                <p className={`font-semibold ${appt.status === 'تم' ? 'text-green-600' :
                                                        appt.status === 'ملغي' ? 'text-red-600' :
                                                            appt.status === 'في الإنتظار' ? 'text-yellow-600 ' :
                                                                'text-[var(--color-text-primary)]'
                                                    }`}>
                                                    {appt.status === 'confirmed' ? 'مؤكد' :
                                                        appt.status === 'cancelled' ? 'ملغي' :
                                                            appt.status === 'pending' ? 'في الانتظار' :
                                                                appt.status || "غير محدد"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">ملاحطات</label>
                                                <p className="text-[var(--color-text-primary)]">{appt.reason || "لا يوجد ملاحظات"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[var(--color-text-secondary)] text-lg">
                                لا توجد مواعيد حجز <EventIcon fontSize="small" />
                            </div>
                        )}
                    </>
                )}

                {activeTab === "notes" && (
                    <>
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                            <NotesIcon fontSize="large" /> الملاحظات العامة
                        </h3>
                        {records.notes ? (
                            <div className="bg-gradient-to-r from-[var(--color-primary-light)] to-[#e0f2f1] p-6 rounded-lg border border-[var(--color-primary)]">
                                <p className="text-[var(--color-text-primary)] leading-relaxed text-lg">{records.notes}</p>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-[var(--color-text-secondary)] text-lg">لا توجد ملاحظات <NotesIcon fontSize="large" /></div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

export default PatientMedicalRecord;