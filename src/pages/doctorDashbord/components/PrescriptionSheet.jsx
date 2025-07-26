import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MedicationIcon from '@mui/icons-material/Medication';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

export default function PrescriptionSheet({ isOpen, onClose, prescription, data, Patient }) {
    if (!isOpen || !prescription) return null;


    const doctor = data.doctors;


    console.log(prescription);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50">
            <div className="bg-white w-full max-w-md mx-4 rounded-lg shadow-lg p-6 relative overflow-auto max-h-[90vh] border-2 border-cyan-600 ">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-1/2  text-gray-500 hover:text-white transition bg-red-100 hover:bg-red-400 rounded-full p-1"
                >
                    <CloseIcon />
                </button>


                <div className="border-b-2 border-cyan-600 pb-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-cyan-800">روشتة طبية</h2>
                        <div className="text-sm bg-cyan-100 text-cyan-800 px-2 py-1 rounded">
                            {prescription.date}
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                        <div>د. {doctor[0].name}</div>
                        <div>تخصص: {doctor[0].specialty}</div>
                    </div>
                </div>


                <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-700 mb-1">بيانات المريض</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500 text-sm">الاسم:</span> {Patient.name}</div>
                        <div><span className="text-gray-500 text-sm">العمر:</span> {Patient.age} </div>
                        <div><span className="text-gray-500 text-sm">الجنس:</span> {Patient.gender}</div>
                        <div><span className="text-gray-500 text-sm">الرقم:</span> {Patient.phone}</div>
                    </div>
                </div>

                {/* الأدوية */}
                {/* <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3 pb-1 border-b border-cyan-200 text-cyan-700 flex items-center gap-2">
                <MedicationIcon fontSize="small" />
                <span>الأدوية الموصوفة</span>
            </h3>
            <ul className="space-y-3">
                {prescription.medications.map((med, index) => (
                    <li key={index} className="border-l-4 border-cyan-500 pl-3 py-2">
                        <div className="font-medium text-gray-800">{med.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">الجرعة:</span> {med.dosage}
                        </div>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">المدة:</span> {med.duration}
                        </div>
      
                    </li>
                ))}
            </ul>
        </div> */}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-1 pb-1 border-b border-cyan-200 text-cyan-700 flex items-center gap-2">
                        <MedicationIcon fontSize="small" />
                        <span>الأدوية الموصوفة</span>
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full ">
                            <thead>
                                <tr className="bg-cyan-50 text-cyan-800 text-sm">
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm ">#</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">اسم الدواء</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">الجرعة</th>
                                    <th className="text-center py-1 px-1 border-b border-cyan-200  text-sm">المدة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.medications.map((med, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                    >
                                        <td className="text-center py-1 px-1 text-gray-500  text-sm">{index + 1}</td>
                                        <td className="text-center py-1 px-2 font-medium text-gray-800  text-sm">{med.name}</td>
                                        <td className="text-center py-1 px-2 text-gray-600  text-sm">{med.dosage}</td>
                                        <td className="text-center py-1 px-2 text-gray-600  text-sm">{med.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* الملاحظات */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-cyan-700 flex items-center gap-2">
                        <NoteAltIcon fontSize="small" />
                        <span>تعليمات وإرشادات</span>
                    </h3>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm text-gray-700 leading-relaxed">
                        {prescription.notes}
                    </div>
                </div>

                {/* تذييل الروشتة */}
                <div className="mt-6 pt-3 border-t border-dashed border-gray-300 text-xs text-gray-500 text-center">
                    <div className="mb-2">شكراً لثقتكم بنا - نتمنى لكم الشفاء العاجل</div>
                </div>
            </div>
        </div>
    );
}
