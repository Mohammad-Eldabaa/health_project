// import React from "react";

// function PatientMedicalRecord({ patient, records }) {
//     // patient: بيانات المريض
//     // records: سجل المريض يشمل زيارات، روشتات، تحاليل

//     const [activeTab, setActiveTab] = React.useState('visits');

//     return (
//         <div className="max-w-4xl mx-auto p-4">
//             <header className="mb-6 flex items-center gap-4">
//                 <div className="w-16 h-16 rounded-full bg-cyan-200 flex items-center justify-center text-cyan-700 text-2xl font-bold">
//                     {patient.fullName?.[0] || 'م'}
//                 </div>
//                 <div>
//                     <h2 className="text-2xl font-bold text-cyan-800">{patient.fullName}</h2>
//                     <p className="text-gray-600">
//                         العمر: {patient.age} سنة | الجنس: {patient.gender}
//                     </p>
//                 </div>
//             </header>

//             {/* Tabs */}
//             <nav className="flex gap-4 border-b border-cyan-200 mb-6">
//                 {['visits', 'prescriptions', 'tests', 'notes'].map((tab) => (
//                     <button
//                         key={tab}
//                         onClick={() => setActiveTab(tab)}
//                         className={`py-2 px-4 border-b-4 ${activeTab === tab
//                                 ? 'border-cyan-600 text-cyan-700 font-semibold'
//                                 : 'border-transparent text-gray-500 hover:text-cyan-600'
//                             } transition`}
//                     >
//                         {tab === 'visits' && 'الزيارات'}
//                         {tab === 'prescriptions' && 'الروشتات'}
//                         {tab === 'tests' && 'التحاليل'}
//                         {tab === 'notes' && 'الملاحظات'}
//                     </button>
//                 ))}
//             </nav>

//             {/* Content */}
//             <section>
//                 {activeTab === 'visits' && (
//                     <div>
//                         {records.visits?.length ? (
//                             <ul className="space-y-4">
//                                 {records.visits.map((visit, idx) => (
//                                     <li
//                                         key={idx}
//                                         className="border rounded p-4 shadow-sm hover:shadow-md transition"
//                                     >
//                                         <p><strong>التاريخ:</strong> {visit.date}</p>
//                                         <p><strong>الطبيب:</strong> {visit.doctorName}</p>
//                                         <p><strong>التشخيص:</strong> {visit.diagnosis}</p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-gray-500">لا توجد زيارات مسجلة</p>
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'prescriptions' && (
//                     <div>
//                         {records.prescriptions?.length ? (
//                             records.prescriptions.map((presc, idx) => (
//                                 <div key={idx} className="mb-4 p-4 border rounded bg-cyan-50">
//                                     <h4 className="font-semibold mb-2">روشتة بتاريخ: {presc.date}</h4>
//                                     <table className="w-full text-center border-collapse border border-gray-300">
//                                         <thead className="bg-cyan-100">
//                                             <tr>
//                                                 <th className="border border-gray-300 p-2">#</th>
//                                                 <th className="border border-gray-300 p-2">اسم الدواء</th>
//                                                 <th className="border border-gray-300 p-2">الجرعة</th>
//                                                 <th className="border border-gray-300 p-2">المدة</th>
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {presc.medications.map((med, i) => (
//                                                 <tr key={i}>
//                                                     <td className="border border-gray-300 p-2">{i + 1}</td>
//                                                     <td className="border border-gray-300 p-2">{med.name}</td>
//                                                     <td className="border border-gray-300 p-2">{med.dosage}</td>
//                                                     <td className="border border-gray-300 p-2">{med.duration}</td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                     <p className="mt-2 text-sm text-gray-600">
//                                         <strong>ملاحظات:</strong> {presc.notes || 'لا توجد ملاحظات'}
//                                     </p>
//                                 </div>
//                             ))
//                         ) : (
//                             <p className="text-gray-500">لا توجد روشتات مسجلة</p>
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'tests' && (
//                     <div>
//                         {records.tests?.length ? (
//                             <ul className="space-y-3">
//                                 {records.tests.map((test, idx) => (
//                                     <li key={idx} className="border rounded p-3 bg-yellow-50 text-gray-700">
//                                         <p><strong>تاريخ التحليل:</strong> {test.date}</p>
//                                         <p><strong>نوع التحليل:</strong> {test.type}</p>
//                                         <p><strong>النتيجة:</strong> {test.result}</p>
//                                     </li>
//                                 ))}
//                             </ul>
//                         ) : (
//                             <p className="text-gray-500">لا توجد تحاليل مسجلة</p>
//                         )}
//                     </div>
//                 )}

//                 {activeTab === 'notes' && (
//                     <div>
//                         {records.notes ? (
//                             <p className="text-gray-700 italic">{records.notes}</p>
//                         ) : (
//                             <p className="text-gray-500">لا توجد ملاحظات</p>
//                         )}
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// }
// export default PatientMedicalRecord;




import React from "react";


function PatientMedicalRecord({ patient = {}, records = {} }) {
    const [activeTab, setActiveTab] = React.useState('visits');

    return (
        <div className="max-w-4xl mx-auto p-4">
            <header className="mb-6 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-cyan-200 flex items-center justify-center text-cyan-700 text-2xl font-bold">
                    {(patient.fullName?.[0]) || 'م'}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-cyan-800">{patient.fullName || 'مريض غير معروف'}</h2>
                    <p className="text-gray-600">
                        العمر: {patient.age ?? 'غير معروف'} سنة | الجنس: {patient.gender || 'غير معروف'}
                    </p>
                </div>
            </header>

            {/* Tabs */}
            <nav className="flex gap-4 border-b border-cyan-200 mb-6">
                {['visits', 'prescriptions', 'tests', 'notes'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 border-b-4 ${activeTab === tab
                                ? 'border-cyan-600 text-cyan-700 font-semibold'
                                : 'border-transparent text-gray-500 hover:text-cyan-600'
                            } transition`}
                    >
                        {tab === 'visits' && 'الزيارات'}
                        {tab === 'prescriptions' && 'الروشتات'}
                        {tab === 'tests' && 'التحاليل'}
                        {tab === 'notes' && 'الملاحظات'}
                    </button>
                ))}
            </nav>

            {/* Content */}
            <section>
                {activeTab === 'visits' && (
                    <div>
                        {records.visits?.length ? (
                            <ul className="space-y-4">
                                {records.visits.map((visit, idx) => (
                                    <li
                                        key={idx}
                                        className="border rounded p-4 shadow-sm hover:shadow-md transition"
                                    >
                                        <p><strong>التاريخ:</strong> {visit.date}</p>
                                        <p><strong>الطبيب:</strong> {visit.doctorName}</p>
                                        <p><strong>التشخيص:</strong> {visit.diagnosis}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">لا توجد زيارات مسجلة</p>
                        )}
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div>
                        {records.prescriptions?.length ? (
                            records.prescriptions.map((presc, idx) => (
                                <div key={idx} className="mb-4 p-4 border rounded bg-cyan-50">
                                    <h4 className="font-semibold mb-2">روشتة بتاريخ: {presc.date}</h4>
                                    <table className="w-full text-center border-collapse border border-gray-300">
                                        <thead className="bg-cyan-100">
                                            <tr>
                                                <th className="border border-gray-300 p-2">#</th>
                                                <th className="border border-gray-300 p-2">اسم الدواء</th>
                                                <th className="border border-gray-300 p-2">الجرعة</th>
                                                <th className="border border-gray-300 p-2">المدة</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {presc.medications?.map((med, i) => (
                                                <tr key={i}>
                                                    <td className="border border-gray-300 p-2">{i + 1}</td>
                                                    <td className="border border-gray-300 p-2">{med.name}</td>
                                                    <td className="border border-gray-300 p-2">{med.dosage}</td>
                                                    <td className="border border-gray-300 p-2">{med.duration}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="mt-2 text-sm text-gray-600">
                                        <strong>ملاحظات:</strong> {presc.notes || 'لا توجد ملاحظات'}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">لا توجد روشتات مسجلة</p>
                        )}
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div>
                        {records.tests?.length ? (
                            <ul className="space-y-3">
                                {records.tests.map((test, idx) => (
                                    <li key={idx} className="border rounded p-3 bg-yellow-50 text-gray-700">
                                        <p><strong>تاريخ التحليل:</strong> {test.date}</p>
                                        <p><strong>نوع التحليل:</strong> {test.type}</p>
                                        <p><strong>النتيجة:</strong> {test.result}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">لا توجد تحاليل مسجلة</p>
                        )}
                    </div>
                )}

                {activeTab === 'notes' && (
                    <div>
                        {records.notes ? (
                            <p className="text-gray-700 italic">{records.notes}</p>
                        ) : (
                            <p className="text-gray-500">لا توجد ملاحظات</p>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
export default PatientMedicalRecord;
