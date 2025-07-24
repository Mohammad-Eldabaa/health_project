import { useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.default.vfs;
pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    }
};


const medicationCategories = {
    'Pain Relievers': ['Paracetamol', 'Ibuprofen', 'Diclofenac', 'Naproxen'],
    'Antibiotics': ['Amoxicillin', 'Azithromycin', 'Ciprofloxacin', 'Doxycycline'],
    'Stomach Medications': ['Omeprazole', 'Ranitidine', 'Domperidone'],
    'Vitamins': ['Vitamin D', 'Vitamin B12', 'Vitamin C']
};


const dosageOptions = [
    'One tablet twice daily',
    'One tablet three times daily',
    'Two tablets every 8 hours',
    'One tablet every 12 hours',
    '500 mg every 8 hours',
    '1 gram every 12 hours',
    'As needed'
];

const durationOptions = [
    '3 days',
    '5 days',
    '7 days',
    '10 days',
    '14 days',
    '21 days',
    'As directed'
];


export default function Prescription({ onClose }) {
    const today = new Date().toLocaleDateString('en-US');
    const [patientName, setPatientName] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedMeds, setSelectedMeds] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Pain Relievers');
    const [currentMed, setCurrentMed] = useState('');
    const [dosage, setDosage] = useState('');
    const [duration, setDuration] = useState('');
    const [showDosageModal, setShowDosageModal] = useState(false);

    const handleMedClick = (med) => {
        setCurrentMed(med);
        setShowDosageModal(true);
    };

    const addMedication = () => {
        const newMed = {
            name: currentMed,
            dosage: dosage || 'جرعة حسب الحاجة',
            duration: duration || 'حسب التعليمات'
        };
        setSelectedMeds([...selectedMeds, newMed]);
        setDosage('');
        setDuration('');
        setShowDosageModal(false);
    };

    const removeMedication = (index) => {
        const updated = [...selectedMeds];
        updated.splice(index, 1);
        setSelectedMeds(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prescriptionData = {
            patientName,
            date: today,
            medications: selectedMeds,
            notes
        };
        localStorage.setItem('lastPrescription', JSON.stringify(prescriptionData));
        alert('تم حفظ الروشتة بنجاح!');
        onClose();
    };

    const printPrescription = () => {
        if (!patientName || selectedMeds.length === 0) {
            alert('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
            return;
        }

        const medsContent = selectedMeds.map((med, index) => ([
            { text: `${index + 1}. ${med.name}`, style: 'medText' },
            { text: `Medical dose: ${med.dosage}`, style: 'subText' },
            { text: `Time: ${med.duration}`, style: 'subText' },
            { text: '\n' }
        ])).flat();

        const docDefinition = {
            content: [
                { text: 'Medical Prescription', style: 'header', alignment: 'center' },
                { text: `Patient Name: ${patientName}`, style: 'subheader' },
                { text: `Date: ${today}`, style: 'subheader' },
                { text: 'Diagnosis / Notes:', style: 'subheader' },
                { text: notes || 'No notes available', style: 'notesText' },
                { text: 'Prescribed Medications:', style: 'subheader', margin: [0, 10, 0, 5] },
                ...medsContent
            ],

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10],
                    font: 'Roboto'
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 5, 0, 3],
                    font: 'Roboto'
                },
                medText: {
                    fontSize: 12,
                    bold: true,
                    font: 'Roboto'
                },
                subText: {
                    fontSize: 11,
                    margin: [20, 0, 0, 0],
                    font: 'Roboto'
                },
                notesText: {
                    fontSize: 12,
                    margin: [0, 0, 0, 10],
                    font: 'Roboto'
                }
            },
            defaultStyle: {
                font: 'Roboto',
                alignment: 'right'
            }
        };

        pdfMake.createPdf(docDefinition).download('prescription.pdf');
    };

    return (
        <>
            <div className="flex items-center gap-3 justify-between">
                <span className="text-base sm:text-lg lg:text-xl px-3">كتابة الروشتة</span>
            </div>
            <div className="bg-gray-100 rounded-2xl mx-2 sm:mx-4 lg:mx-6 my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-5">


                <div className="min-h-screen bg-gray-100 p-1 ">




                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Right Side */}
                        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-bold mb-4 " style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

                            <div className="bg-gray-100 p-2 rounded-lg mb-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                                    {Object.keys(medicationCategories).map(category => (
                                        <button
                                            key={category}
                                            onClick={() => setActiveCategory(category)}
                                            className={`w-full py-2 rounded-lg text-center font-medium transition ${activeCategory === category
                                                ? 'bg-cyan-500 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            style={{ backgroundColor: activeCategory === category ? "var(--color-accent)" : undefined }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>


                            <div className="grid grid-cols-2 gap-3">
                                {medicationCategories[activeCategory].map(med => (
                                    <button
                                        key={med}
                                        onClick={() => handleMedClick(med)}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-center flex items-center justify-center h-15"
                                    >
                                        <span className="font-medium">{med}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Left Side  */}
                        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold " style={{ color: "var(--color-primary)" }}>روشتة العلاج</h2>
                                <div className="text-gray-600">
                                    <p className="font-medium">التاريخ: {today}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">اسم المريض</label>
                                <input
                                    type="text"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    required
                                />
                            </div>

                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                <div className=" p-3 grid grid-cols-12 gap-1 font-medium "
                                    style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
                                    <span className="col-span-5">الدواء</span>
                                    <span className="col-span-3">الجرعة</span>
                                    <span className="col-span-3">المدة</span>
                                    <span className="col-span-1">إزالة</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {selectedMeds.length > 0 ? (
                                        selectedMeds.map((med, index) => (
                                            <div key={index} className="border-b border-gray-200 p-3 grid grid-cols-12 gap-1 items-center hover:bg-gray-50">
                                                <span className="col-span-5 font-medium">{med.name}</span>
                                                <span className="col-span-3 text-gray-600">{med.dosage}</span>
                                                <span className="col-span-3 text-gray-600">{med.duration}</span>
                                                <button
                                                    onClick={() => removeMedication(index)}
                                                    className="col-span-1 text-red-500 hover:text-red-700"
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>لا توجد أدوية مضافة</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">ملاحظات الطبيب</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    rows="4"
                                    placeholder="التشخيص أو أي تعليمات إضافية..."
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition justify-center"
                                    style={{ backgroundColor: "var(--color-accent)" }}
                                >
                                    حفظ الروشتة
                                </button>
                                <button
                                    onClick={printPrescription}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition justify-center"
                                    style={{ backgroundColor: "var(--color-accent)" }}
                                >
                                    طباعة الروشتة
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal*/}
                    {showDosageModal && (
                        <div className="fixed inset-0  flex justify-center items-center z-50 overflow-auto ">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                                <h3 className="text-xl font-bold mb-4 "
                                    style={{ color: "var(--color-primary)" }}
                                >تحديد جرعة الدواء: {currentMed}</h3>

                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {dosageOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setDosage(option)}
                                                className={`p-2 border rounded-lg text-sm ${dosage === option ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={dosage}
                                        onChange={(e) => setDosage(e.target.value)}
                                        placeholder="أو اكتب جرعة مخصصة"
                                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {durationOptions.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setDuration(option)}
                                                className={`p-2 border rounded-lg text-sm ${duration === option ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        placeholder="أو اكتب مدة مخصصة"
                                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowDosageModal(false);
                                            setDosage('');
                                            setDuration('');
                                        }}
                                        className="flex-1  text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                        style={{ backgroundColor: "var(--color-accent)" }}

                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={addMedication}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                        disabled={!dosage || !duration}
                                        style={{ backgroundColor: "var(--color-accent)" }}

                                    >
                                        تأكيد وإضافة
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

}