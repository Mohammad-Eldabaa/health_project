
import { useState, useEffect } from 'react';
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


const data = JSON.parse(localStorage.getItem('doctorDashboardData')) || [];
let medicationsData = data.medicationCategories;
let dosageOptionsData = data.dosageOptions;
let durationOptionsData = data.durationOptions;
console.log(durationOptionsData);


export default function PrescriptionModel({ isOpen, onClose, selectedPatient }) {
  const today = new Date().toLocaleDateString('ar-EG');
  const [patientName, setPatientName] = useState(selectedPatient?.name || '');
  const [notes, setNotes] = useState('');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('مسكنات');
  const [currentMed, setCurrentMed] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [showDosageModal, setShowDosageModal] = useState(false);



  useEffect(() => {
    setPatientName(selectedPatient?.name || '');
  }, [selectedPatient]);




  if (!isOpen) return null;

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

  if (!patientName || selectedMeds.length === 0) {
    alert('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
    return;
  }

  try {
    // قراءة البيانات من localStorage
    const dashboardData = JSON.parse(localStorage.getItem('doctorDashboardData')) || {};
    const patients = dashboardData.patients || [];

    // تجهيز بيانات الروشتة
    const prescriptionItems = selectedMeds.map((med) => ({
      id: Date.now() + Math.random(),
      name: med.name,
      category: med.category,
      dosage: med.dosage,
      duration: med.duration
    }));

    const newVisit = {
      id: Date.now(),
      date: today,
      notes: notes,
      diagnosis: notes,
      prescriptions: prescriptionItems
    };

    // البحث عن المريض
    const patientIndex = patients.findIndex(p => p.name === patientName);

    if (patientIndex === -1) {
      // المريض مش موجود
      const newPatient = {
        id: Date.now(),
        name: patientName,
        age: null,
        gender: "غير محدد",
        phone: "",
        address: "",
        status: "جديد",
        blood: "",
        Medical_condition: "غير محدد",
        chronic_diseases: [],
        visits: [newVisit],
        tests: []
      };
      patients.push(newPatient);
    } else {
      // المريض موجود، نضيف الزيارة
      if (!patients[patientIndex].visits) {
        patients[patientIndex].visits = [];
      }
      patients[patientIndex].visits.push(newVisit);
    }

    // تحديث البيانات داخل doctorDashboardData
    dashboardData.patients = patients;

    // حفظ البيانات في localStorage
    localStorage.setItem('doctorDashboardData', JSON.stringify(dashboardData));

    window.dispatchEvent(new Event("storage"));

    alert('تم حفظ الروشتة داخل doctorDashboardData!');
    onClose();

  } catch (error) {
    console.error('خطأ أثناء حفظ البيانات:', error);
    alert('حدث خطأ أثناء حفظ البيانات');
  }
};


  const printPrescription = () => {


    if (!patientName || selectedMeds.length === 0) {
      alert('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
      return;
    }
    const medsContent = selectedMeds.map((med, index) => ([
      { text: `${index + 1}. ${med.name}`, style: 'medText' },
      { text: `الجرعة: ${med.dosage}`, style: 'subText' },
      { text: `المدة: ${med.duration}`, style: 'subText' },
      { text: '\n' }
    ])).flat();

    const docDefinition = {
      content: [
        { text: 'روشتة طبية', style: 'header', alignment: 'center' },
        { text: `اسم المريض: ${patientName}`, style: 'subheader' },
        { text: `التاريخ: ${today}`, style: 'subheader' },
        { text: 'التشخيص/الملاحظات:', style: 'subheader' },
        { text: notes || 'لا توجد ملاحظات', style: 'notesText' },
        { text: 'الأدوية الموصوفة:', style: 'subheader', margin: [0, 10, 0, 5] },
        ...medsContent
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 3] },
        medText: { fontSize: 12, bold: true },
        subText: { fontSize: 11, margin: [20, 0, 0, 0] },
        notesText: { fontSize: 12, margin: [0, 0, 0, 10] }
      },

      defaultStyle: {
        font: 'Roboto',
        alignment: 'right'
      }

    };

    pdfMake.createPdf(docDefinition).open();
  };

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">


      {showDosageModal && (
        <div className="fixed inset-0 bg-gray-500/60 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-400">
            <h3 className="text-xl font-bold mb-4 text-blue-800"
              style={{ color: "var(--color-primary)" }}
            >تحديد جرعة الدواء: {currentMed}</h3>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
              <div className="grid grid-cols-2 gap-2">
                {dosageOptionsData.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setDosage(option)}
                    className={`p-2 border rounded-lg text-sm ${dosage === option ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
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
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptionsData.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setDuration(option)}
                    className={`p-2 border rounded-lg text-sm ${duration === option ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
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
                className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl relative  overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">نظام صرف الأدوية</h2>

        <button
          className="absolute top-2 left-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖ إغلاق
        </button>

        <div className="flex flex-col lg:flex-row gap-6 mt-6 h-[80vh] ">
          {/* Right Side  */}
          <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200 ">
            <h2 className="text-xl font-bold mb-4 " style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

            <div className="bg-gray-100 p-2 rounded-lg mb-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {medicationsData.map(cat => (
                  <button
                    key={cat.category}
                    onClick={() => setActiveCategory(cat.category)}
                    className={`w-full py-2 rounded-lg border-gray-300 text-center font-medium transition ${activeCategory === cat.category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border'
                      }`}
                    style={{ backgroundColor: activeCategory === cat.category ? "var(--color-accent)" : undefined }}
                  >
                    {cat.category}
                  </button>
                ))}
              </div>
            </div>


            <div className="grid grid-cols-2 gap-3">
              {
                // دور على الفئة المختارة
                medicationsData.find(cat => cat.category === activeCategory)?.medications.map((med, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMedClick(med)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center flex items-center justify-center h-20"
                  >
                    <span className="font-medium">{med}</span>
                  </button>
                ))
              }
            </div>

          </div>

          {/* Left Side */}
          <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200 
">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="border border-gray-200 rounded-lg mb-6 overflow-y-auto">
              <div className=" p-3 grid grid-cols-12 gap-1 font-medium text-blue-800"
                style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
                <span className="col-span-5">الدواء</span>
                <span className="col-span-3">الجرعة</span>
                <span className="col-span-3">المدة</span>
                <span className="col-span-1">إزالة</span>
              </div>
              <div className="max-h-64 ">
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
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      </div>
    </div>
  );
}

