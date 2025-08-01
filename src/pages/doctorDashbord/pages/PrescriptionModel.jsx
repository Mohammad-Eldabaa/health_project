
import { useState, useEffect, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { supabase } from '../../../supaBase/booking';
import { usePrescriptionStore } from '../../../store/prescriptionStore';
import { setupRealtimePatients, removeRealtimeChannel } from "../../../lib/supabaseRealtime";
import PrintPrescription from '../components/PrintPrescription';
import { toast } from 'react-toastify';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const printRef = useRef();
  const realtimeChannel = useRef(null);

  const { drug_categories: medicationsData, dosage_options: dosageOptionsData, 
          duration_options: durationOptionsData } = useDoctorDashboardStore();
  const prescriptionStore = usePrescriptionStore();

  // دالة الطباعة المحسنة
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { size: A4; margin: 10mm; }
      body { direction: rtl; font-family: 'Arial', sans-serif; }
      @media print { .no-print { display: none !important; } }
    `,
    onBeforePrint: () => toast.info('جاري إعداد الطباعة...'),
    onAfterPrint: () => toast.success('تمت الطباعة بنجاح'),
    removeAfterPrint: false,
    documentTitle: `روشتة_طبية_${patientName}_${today.replace(/\//g, '-')}`,
  });

  // إعداد اشتراكات الوقت الحقيقي
  useEffect(() => {
    if (!isOpen || !selectedPatient?.id) return;

    const initRealtime = async () => {
      try {
        // إعداد الاشتراكات مع فلترة حسب المريض
        realtimeChannel.current = setupRealtimePatients(selectedPatient.id);
        
        // جلب البيانات الأولية
        await prescriptionStore.fetchPatientPrescriptions(selectedPatient.id);
      } catch (error) {
        console.error('Error initializing realtime:', error);
        toast.error('حدث خطأ في الاتصال بالخادم');
      }
    };

    initRealtime();

    return () => {
      if (realtimeChannel.current) {
        removeRealtimeChannel(realtimeChannel.current);
      }
    };
  }, [isOpen, selectedPatient?.id]);

  // تحديث اسم المريض عند تغيير المريض المحدد
  useEffect(() => {
    setPatientName(selectedPatient?.fullName || '');
  }, [selectedPatient]);

  // إضافة دواء جديد
  const addMedication = useCallback(() => {
    const newMed = {
      name: currentMed,
      dosage: dosage || 'جرعة حسب الحاجة',
      duration: duration || 'حسب التعليمات'
    };
    setSelectedMeds(prev => [...prev, newMed]);
    setDosage('');
    setDuration('');
    setShowDosageModal(false);
    toast.success('تم إضافة الدواء');
  }, [currentMed, dosage, duration]);

  // إزالة دواء
  const removeMedication = useCallback((index) => {
    setSelectedMeds(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    toast.info('تم إزالة الدواء');
  }, []);

  // حفظ الوصفة الطبية
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!patientName || selectedMeds.length === 0) {
      toast.warn('الرجاء إدخال اسم المريض وإضافة أدوية أولاً');
      return;
    }

    setIsSubmitting(true);

    try {
      const currentDoctorId = 1; // يجب استبدالها بالرقم الفعلي للطبيب

      // البحث عن المريض أو إنشائه
      let patientId;
      const { data: existingPatient, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('fullName', patientName)
        .single();

      if (patientError && patientError.code !== 'PGRST116') throw patientError;

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

      // إنشاء زيارة
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

      // إنشاء سجل طبي
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

      // حفظ الوصفة الطبية
      await prescriptionStore.savePrescription(patientId, visit.id, {
        notes: notes,
        medications: selectedMeds
      });

      // تحديث حالة الموعد إذا كان مرتبطًا
      if (selectedPatient?.appointment_id) {
        await supabase
          .from('appointments')
          .update({ status: 'completed' })
          .eq('id', selectedPatient.appointment_id);
      }

      toast.success('تم حفظ الروشتة بنجاح!');
      onClose();
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error(`حدث خطأ: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

    const handleMedClick = useCallback((medName) => {
    setCurrentMed(medName);
    setShowDosageModal(true);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex justify-center items-center z-50">
      {/* مكون الطباعة المخفي */}
      <div style={{ display: 'none' }}>
        <PrintPrescription
          ref={printRef}
          patientName={patientName}
          today={today}
          notes={notes}
          selectedMeds={selectedMeds}
        />
      </div>

      {/* نافذة الجرعة */}
      {showDosageModal && (
        <DosageModal 
          currentMed={currentMed}
          dosage={dosage}
          setDosage={setDosage}
          duration={duration}
          setDuration={setDuration}
          dosageOptionsData={dosageOptionsData}
          durationOptionsData={durationOptionsData}
          onClose={() => {
            setShowDosageModal(false);
            setDosage('');
            setDuration('');
          }}
          onConfirm={addMedication}
        />
      )}

      {/* النافذة الرئيسية */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl relative overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">نظام صرف الأدوية</h2>
        
        <button
          className="absolute top-2 left-2 text-gray-500 hover:text-black"
          onClick={onClose}
          disabled={isSubmitting}
        >
          ✖ إغلاق
        </button>

        <div className="flex flex-col lg:flex-row gap-6 mt-6 h-[80vh]">
          {/* جانب الأدوية */}
          <MedicationsSection 
            medicationsData={medicationsData}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            handleMedClick={handleMedClick}
          />
          
          {/* جانب الوصفة الطبية */}
          <PrescriptionSection
            patientName={patientName}
            today={today}
            notes={notes}
            setNotes={setNotes}
            selectedMeds={selectedMeds}
            removeMedication={removeMedication}
            handleSubmit={handleSubmit}
            handlePrint={handlePrint}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

// مكونات فرعية مساعدة
const DosageModal = ({ 
  currentMed, 
  dosage, 
  setDosage, 
  duration, 
  setDuration, 
  dosageOptionsData, 
  durationOptionsData, 
  onClose, 
  onConfirm 
}) => (
  <div className="fixed inset-0 bg-gray-500/60 flex justify-center items-center z-50 overflow-auto">
    <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md border border-gray-400">
      <h3 className="text-xl font-bold mb-4 text-blue-800" style={{ color: "var(--color-primary)" }}>
        تحديد جرعة الدواء: {currentMed}
      </h3>

      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
        <div className="grid grid-cols-2 gap-2">
          {dosageOptionsData?.map((option) => (
            <button
              key={option.id}
              onClick={() => setDosage(option.value)}
              className={`p-2 border rounded-lg text-sm ${dosage === option.value
                ? 'bg-blue-100 border-blue-500'
                : 'border-gray-300 hover:bg-gray-50'}`}
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
                : 'border-gray-300 hover:bg-gray-50'}`}
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
          onClick={onClose}
          className="flex-1 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          إلغاء
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
          disabled={!dosage || !duration}
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          تأكيد وإضافة
        </button>
      </div>
    </div>
  </div>
);

const MedicationsSection = ({ medicationsData, activeCategory, setActiveCategory, handleMedClick }) => (
  <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

    <div className="bg-gray-100 p-2 rounded-lg mb-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {medicationsData.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`w-full py-2 rounded-lg text-center font-medium transition ${
              activeCategory === cat.name
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            style={{
              backgroundColor: activeCategory === cat.name ? 'var(--color-accent)' : undefined,
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
);

const PrescriptionSection = ({
  patientName,
  today,
  notes,
  setNotes,
  selectedMeds,
  removeMedication,
  handleSubmit,
  handlePrint,
  isSubmitting
}) => (
  <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4 border border-gray-200">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>روشتة العلاج</h2>
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
      <div className="p-3 grid grid-cols-12 gap-1 font-medium text-blue-800"
        style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
        <span className="col-span-5">الدواء</span>
        <span className="col-span-3">الجرعة</span>
        <span className="col-span-3">المدة</span>
        <span className="col-span-1">إزالة</span>
      </div>
      <div className="max-h-64">
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
        disabled={isSubmitting}
        className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${
          isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        }`}
        style={{ backgroundColor: isSubmitting ? undefined : "var(--color-accent)" }}
      >
        {isSubmitting ? 'جاري الحفظ...' : 'حفظ الروشتة'}
      </button>
      <button
        onClick={handlePrint}
        disabled={selectedMeds.length === 0}
        className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${
          selectedMeds.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        style={{ backgroundColor: selectedMeds.length === 0 ? undefined : "var(--color-accent)" }}
      >
        طباعة الروشتة
      </button>
    </div>
  </div>
);