
import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { supabase } from '../../../supaBase/booking';
import { usePrescriptionStore } from '../../../store/prescriptionStore';
import { setupRealtimePatients } from "../../../lib/supabaseRealtime";
import PrintPrescription from '../components/PrintPrescription';


export default function PrescriptionModel({ isOpen, onClose, selectedPatient }) {
  const today = new Date().toLocaleDateString('en-US');
  const [patientName, setPatientName] = useState(selectedPatient?.fullName || '');
  const [notes, setNotes] = useState('');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [activeCategory, setActiveCategory] = useState('مسكنات');
  const [currentMed, setCurrentMed] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [showDosageModal, setShowDosageModal] = useState(false);



    const printRef = useRef();

const { drug_categories: medicationsData, dosage_options: dosageOptionsData, duration_options: durationOptionsData } = useDoctorDashboardStore();  
const prescriptionStore = usePrescriptionStore();

 const handlePrint = useReactToPrint({
  content: () => {
    if (!printRef.current) {
      alert('لا يوجد محتوى للطباعة');
      return null;
    }
    return printRef.current;
  },
  pageStyle: `
    @page {
      size: A4;
      margin: 10mm;
    }
    body {
      direction: rtl;
      font-family: 'Arial', sans-serif;
    }
    @media print {
      .no-print {
        display: none !important;
      }
    }
  `,
  onBeforePrint: () => console.log('بدء الطباعة...'),
  onAfterPrint: () => console.log('تمت الطباعة'),
  removeAfterPrint: false,
  documentTitle: `روشتة_طبية_${patientName}_${today}`,
});




  useEffect(() => {
    const channel = setupRealtimePatients();
    return () => channel.unsubscribe();
  }, []);

  
  useEffect(() => {
    setPatientName(selectedPatient?.fullName || '');
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedPatient?.id) {
      // Initialize real-time subscriptions when patient is selected
      prescriptionStore.initRealtime(selectedPatient.id);
      
      // Clean up on unmount
      return () => {
        prescriptionStore.cleanupRealtime();
      };
    }
  }, [selectedPatient?.id]);

  const handleMedClick = (medName) => {
    setCurrentMed(medName);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientName || selectedMeds.length === 0) {
      alert('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
      return;
    }

    try {
      const currentDoctorId = 1; // Replace with actual doctor ID

      // Find or create patient
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('fullName', patientName)
        .single();

      let patientId;
      
      if (patientError && patientError.code !== 'PGRST116') {
        throw patientError;
      }

      if (!existingPatient) {
        const { data: newPatient, error: insertError } = await supabase
          .from('patients')
          .insert([{
            fullName: patientName,
            age: null,
            gender: "غير محدد",
            phoneNumber: "",
            address: "",
            status: "جديد",
            blood: "",
            chronic_diseases: []
          }])
          .select('id')
          .single();

        if (insertError) throw insertError;
        patientId = newPatient.id;
      } else {
        patientId = existingPatient.id;
      }

      // Create visit
      const { data: visit, error: visitError } = await supabase
        .from('visits')
        .insert([{
          patient_id: patientId,
          doctor_id: currentDoctorId,
          date: today,
          notes: notes,
          appointment_id: selectedPatient?.appointment_id || null
        }])
        .select('id')
        .single();

      if (visitError) throw visitError;

      // Create medical record
      const { data: medicalRecord, error: recordError } = await supabase
        .from('medical_records')
        .insert([{
          patient_id: patientId,
          visit_id: visit.id,
          date: today,
          diagnosis: notes,
          notes: notes
        }])
        .select('id')
        .single();

      if (recordError) throw recordError;

      // Save prescription using the store
      await prescriptionStore.savePrescription(patientId, visit.id, {
        notes: notes,
        medications: selectedMeds
      });

      // Update appointment status if linked
      if (selectedPatient?.appointment_id) {
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', selectedPatient.appointment_id);
      }

      alert('تم حفظ الروشتة في قاعدة البيانات بنجاح!');
      onClose();
    } catch (error) {
      console.error('خطأ أثناء حفظ البيانات:', error);
      alert(`حدث خطأ: ${error.message}`);
    }
  };

  // const printPrescription = () => {
  //   if (!patientName || selectedMeds.length === 0) {
  //     alert('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
  //     return;
  //   }

  //   const medsContent = selectedMeds.map((med, index) => ([
  //     { text: `${index + 1}. ${med.name}`, style: 'medText' },
  //     { text: `الجرعة: ${med.dosage}`, style: 'subText' },
  //     { text: `المدة: ${med.duration}`, style: 'subText' },
  //     { text: '\n' }
  //   ])).flat();

  //   const docDefinition = {
  //     content: [
  //       { text: 'روشتة طبية', style: 'header', alignment: 'center' },
  //       { text: `اسم المريض: ${patientName}`, style: 'subheader' },
  //       { text: `التاريخ: ${today}`, style: 'subheader' },
  //       { text: 'التشخيص/الملاحظات:', style: 'subheader' },
  //       { text: notes || 'لا توجد ملاحظات', style: 'notesText' },
  //       { text: 'الأدوية الموصوفة:', style: 'subheader', margin: [0, 10, 0, 5] },
  //       ...medsContent
  //     ],
  //     styles: {
  //       header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
  //       subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 3] },
  //       medText: { fontSize: 12, bold: true },
  //       subText: { fontSize: 11, margin: [20, 0, 0, 0] },
  //       notesText: { fontSize: 12, margin: [0, 0, 0, 10] }
  //     },
  //     defaultStyle: {
  //       font: 'Roboto',
  //       alignment: 'right'
  //     }
  //   };

  //   pdfMake.createPdf(docDefinition).open();
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">

      <div style={{ display: 'none' }}>
        <PrintPrescription
          ref={printRef}
          patientName={patientName}
          today={today}
          notes={notes}
          selectedMeds={selectedMeds}
        />
      </div>

      {showDosageModal && (
        <div className="fixed inset-0 bg-gray-500/60 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-400">
            <h3 className="text-xl font-bold mb-4 text-blue-800"
              style={{ color: "var(--color-primary)" }}
            >تحديد جرعة الدواء: {currentMed}</h3>

            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
              <div className="grid grid-cols-2 gap-2">
                {dosageOptionsData?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setDosage(option.value)}
                    className={`p-2 border rounded-lg text-sm ${dosage === option.value
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {option.value}
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
                {durationOptionsData?.map((option) => (
                  <button
                    key={option.id} 
                    onClick={() => setDuration(option.value)} 
                    className={`p-2 border rounded-lg text-sm ${duration === option.value
                      ? 'bg-blue-100 border-blue-500'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {option.value}
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
                className="flex-1 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
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
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full py-2 rounded-lg border-gray-300 text-center font-medium transition ${activeCategory === cat.name
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border'
                      }`}
                    style={{
                      backgroundColor:
                        activeCategory === cat.name ? 'var(--color-accent)' : undefined,
                    }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {medicationsData.find(cat => cat.name === activeCategory)?.medications?.length ? (
                medicationsData.find(cat => cat.name === activeCategory).medications.map((med, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleMedClick(med.name)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center flex items-center justify-center h-20"
                  >
                    <span className="font-medium">{med.name}</span>
                  </button>
                ))
              ) : (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  <p>لا توجد أدوية في هذه الفئة</p>
                </div>
              )}
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
                disabled
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
                onClick={handlePrint}
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