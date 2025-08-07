import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '../../../supaBase/booking';
import { toast } from 'react-toastify';
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { usePrescriptionStore } from '../../../store/prescriptionStore';
import PatientSearch from '../components/PatientSearchPrescription';
import { useReactToPrint } from 'react-to-print';
import PrintPrescription from '../components/PrintPrescription';
import { setupRealtimePatients, removeRealtimeChannel } from "../../../lib/supabaseRealtime";

export default function Prescription({ onClose }) {
    const today = new Date().toLocaleDateString('en-US');
    const [formData, setFormData] = useState({
        patientName: '',
        notes: '',
        selectedMeds: [],
        activeCategory: 'مسكنات',
        currentMed: '',
        dosage: '',
        duration: '',
    });
    const [showDosageModal, setShowDosageModal] = useState(false);
    const [showManageMedicationsModal, setShowManageMedicationsModal] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [newMedication, setNewMedication] = useState({
        name: '',
        category_id: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const { drug_categories: medicationsData, dosage_options: dosageOptionsData, duration_options: durationOptionsData } = useDoctorDashboardStore();
    const prescriptionStore = usePrescriptionStore();
    const printRef = useRef(null);
    const realtimeChannel = useRef(null);

useEffect(() => {
    useDoctorDashboardStore.getState().fetchDrugCategories();
}, []);



    // إعداد اشتراكات الوقت الحقيقي
    useEffect(() => {
        if (!selectedPatient?.id) return;

        const initRealtime = async () => {
            try {
                realtimeChannel.current = setupRealtimePatients(selectedPatient.id);
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
    }, [selectedPatient?.id]);

    const medicationsList = useMemo(() => {
        return medicationsData?.find(cat => cat.name === formData.activeCategory)?.medications || [];
    }, [medicationsData, formData.activeCategory]);

    const handleMedClick = useCallback((med) => {
        setFormData(prev => ({ ...prev, currentMed: med }));
        setShowDosageModal(true);
    }, []);

    const addMedication = useCallback(() => {
        const newMed = {
            name: formData.currentMed,
            dosage: formData.dosage || 'جرعة حسب الحاجة',
            duration: formData.duration || 'حسب التعليمات'
        };
        setFormData(prev => ({
            ...prev,
            selectedMeds: [...prev.selectedMeds, newMed],
            dosage: '',
            duration: '',
        }));
        setShowDosageModal(false);
        toast.success('تم إضافة الدواء');
    }, [formData.currentMed, formData.dosage, formData.duration]);

    const removeMedication = useCallback((index) => {
        setFormData(prev => {
            const updated = [...prev.selectedMeds];
            updated.splice(index, 1);
            return { ...prev, selectedMeds: updated };
        });
        toast.info('تم إزالة الدواء');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient || formData.selectedMeds.length === 0) {
            toast.warn('الرجاء اختيار مريض وإضافة أدوية أولاً');
            return;
        }

        setIsSubmitting(true);
        try {
            const currentDoctorId = 1; // استبدال برقم الطبيب الفعلي

            // إنشاء زيارة
            const { data: visit, error: visitError } = await supabase
                .from('visits')
                .insert([{
                    patient_id: selectedPatient.id,
                    doctor_id: currentDoctorId,
                    date: today,
                    notes: formData.notes,
                    appointment_id: selectedPatient?.appointment_id || null
                }])
                .select('id')
                .single();

            if (visitError) throw visitError;

            // إنشاء سجل طبي
            const { data: medicalRecord, error: recordError } = await supabase
                .from('medical_records')
                .insert([{
                    patient_id: selectedPatient.id,
                    visit_id: visit.id,
                    date: today,
                    diagnosis: formData.notes,
                    notes: formData.notes
                }])
                .select('id')
                .single();

            if (recordError) throw recordError;

            // حفظ الوصفة الطبية
            await prescriptionStore.savePrescription(selectedPatient.id, visit.id, {
                notes: formData.notes,
                medications: formData.selectedMeds
            });

            // تحديث حالة الموعد إذا كان مرتبطًا
            if (selectedPatient?.appointment_id) {
                await supabase
                    .from('appointments')
                    .update({ status: 'تم' })
                    .eq('id', selectedPatient.appointment_id);
            }

            toast.success('تم حفظ الروشتة بنجاح!');
            if (typeof onClose === 'function') onClose();
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: `
            @page { size: A4; margin: 10mm; }
            body { direction: rtl; font-family: 'Tajawal', sans-serif; }
            @media print { .no-print { display: none !important; } }
        `,
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                if (formData.selectedMeds.length === 0) {
                    toast.warn('الرجاء إضافة أدوية أولاً');
                    resolve();
                    return;
                }
                resolve();
            });
        },
        onAfterPrint: () => toast.success('تمت الطباعة بنجاح'),
        documentTitle: `روشتة_${formData.patientName}_${today.replace(/\//g, '-')}`,
    });




    const addCategory = async () => {
        if (!newCategory.trim()) {
            toast.warn('الرجاء إدخال اسم التصنيف');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('drug_categories')
                .insert([{ name: newCategory }])
                .select();

            if (error) throw error;
        await useDoctorDashboardStore.getState().fetchDrugCategories(); // إضافة هذا السطر

            toast.success('تم إضافة التصنيف بنجاح');
            setNewCategory('');
            // يمكنك هنا تحديث البيانات المحلية أو إعادة جلب البيانات من السيرفر
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        }
    };

    // دالة لإضافة دواء جديد
    const addMedicationToDB = async () => {
        if (!newMedication.name.trim() || !newMedication.category_id) {
            toast.warn('الرجاء إدخال اسم الدواء واختيار التصنيف');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('medications')
                .insert([{
                    name: newMedication.name,
                    category_id: newMedication.category_id,
                    description: newMedication.description
                }])
                .select();

            if (error) throw error;

        await useDoctorDashboardStore.getState().fetchDrugCategories();

            toast.success('تم إضافة الدواء بنجاح');
            setNewMedication(prev => ({
                name: '',
                category_id: prev.category_id, 
                description: ''
            }));
        } catch (error) {
            console.error('Error adding medication:', error);
            toast.error(`حدث خطأ: ${error.message}`);
        }
    };


    return (
        <>
            <div className="flex items-center gap-3 justify-between pt-5 px-2 md:px-8">
                <span className="text-base sm:text-lg lg:text-xl px-3">كتابة الروشتة</span>
                <button
                    onClick={() => setShowManageMedicationsModal(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
                >
                    إضافة أدوية </button>
            </div>
            <div className="bg-gray-100 rounded-2xl mx-2 sm:mx-4 lg:mx-6 my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-5">
                <div className="min-h-screen bg-gray-100 p-1">
                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Right Side - Medications */}
                        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>تصنيفات الأدوية</h2>

                            {/* Categories */}
                            <div className="bg-gray-100 p-2 rounded-lg mb-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2">
                                    {medicationsData?.map(cat => (
                                        <button
                                            key={cat.name}
                                            onClick={() => setFormData(prev => ({ ...prev, activeCategory: cat.name }))}
                                            className={`w-full py-2 rounded-lg text-center font-medium transition ${formData.activeCategory === cat.name
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-white text-gray-700 border border-gray-300'
                                                }`}
                                            style={{ backgroundColor: formData.activeCategory === cat.name ? "var(--color-accent)" : undefined }}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Medications List */}
                            <div className="grid grid-cols-2 gap-3">
                                {medicationsList.length > 0 ? (
                                    medicationsList.map((med, idx) => (
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

                        {/* Left Side - Prescription Form */}
                        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-5">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold" style={{ color: "var(--color-primary)" }}>روشتة العلاج</h2>
                                <div className="text-gray-600">
                                    <p className="font-medium">التاريخ: {today}</p>
                                </div>
                            </div>

                            {/* Patient Search */}
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">اسم المريض</label>
                                <PatientSearch
                                    onPatientSelect={(patient) => {
                                        setSelectedPatient(patient);
                                        setFormData(prev => ({ ...prev, patientName: patient.fullName }));
                                    }}
                                />
                            </div>

                            {/* Medications Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                                <div className="p-3 grid grid-cols-12 gap-1 font-medium"
                                    style={{ backgroundColor: "var(--color-primary-light)", color: "var(--color-text-primary)" }}>
                                    <span className="col-span-5">الدواء</span>
                                    <span className="col-span-3">الجرعة</span>
                                    <span className="col-span-3">المدة</span>
                                    <span className="col-span-1">إزالة</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {formData.selectedMeds.length > 0 ? (
                                        formData.selectedMeds.map((med, index) => (
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

                            {/* Doctor Notes */}
                            <div className="mb-6">
                                <label className="block mb-2 font-medium text-gray-700">ملاحظات الطبيب</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    rows="4"
                                    placeholder="التشخيص أو أي تعليمات إضافية..."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${isSubmitting ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    style={{ backgroundColor: isSubmitting ? undefined : "var(--color-accent)" }}
                                >
                                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ الروشتة'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (formData.selectedMeds.length === 0) {
                                            toast.warn('الرجاء إضافة أدوية أولاً');
                                            return;
                                        }
                                        handlePrint().catch(() => {
                                            toast.error('حدث خطأ أثناء الطباعة');
                                        });
                                    }}
                                    disabled={formData.selectedMeds.length === 0}
                                    className={`flex-1 text-white px-6 py-3 rounded-lg font-medium transition justify-center ${formData.selectedMeds.length === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    style={{ backgroundColor: formData.selectedMeds.length === 0 ? undefined : "var(--color-accent)" }}
                                >
                                    طباعة الروشتة
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dosage Modal */}
                    {showDosageModal && (
                        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-gray-500/60">
                            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-200">
                                <h3 className="text-xl font-bold mb-4"
                                    style={{ color: "var(--color-primary)" }}
                                >تحديد جرعة الدواء: {formData.currentMed}</h3>

                                <div className="mb-4">
                                    <label className="block mb-2 font-medium text-gray-700">اختر الجرعة</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {dosageOptionsData?.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setFormData(prev => ({ ...prev, dosage: option.value }))}
                                                className={`p-2 border rounded-lg text-sm ${formData.dosage === option.value ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {option.value}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.dosage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                                        placeholder="أو اكتب جرعة مخصصة"
                                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block mb-2 font-medium text-gray-700">اختر المدة</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {durationOptionsData?.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => setFormData(prev => ({ ...prev, duration: option.value }))}
                                                className={`p-2 border rounded-lg text-sm ${formData.duration === option.value ? 'bg-cyan-100 border-cyan-500' : 'border-gray-300 hover:bg-gray-50'}`}
                                            >
                                                {option.value}
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                        placeholder="أو اكتب مدة مخصصة"
                                        className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setShowDosageModal(false);
                                            setFormData(prev => ({ ...prev, dosage: '', duration: '' }));
                                        }}
                                        className="flex-1 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                        style={{ backgroundColor: "var(--color-accent)" }}
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        onClick={addMedication}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition justify-center"
                                        disabled={!formData.dosage || !formData.duration}
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

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg">
                        <p>جاري حفظ البيانات...</p>
                    </div>
                </div>
            )}

            <div style={{ display: 'none' }}>
                <PrintPrescription
                    ref={printRef}
                    patientName={formData.patientName}
                    today={today}
                    notes={formData.notes}
                    selectedMeds={formData.selectedMeds}
                />
            </div>


            {showManageMedicationsModal && (
                <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-gray-500/60">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200">
                        <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                            إدارة الأدوية والتصنيفات
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Add Category Section */}
                            <div className="border p-4 rounded-lg">
                                <h4 className="font-bold mb-3">إضافة تصنيف جديد</h4>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) => setNewCategory(e.target.value)}
                                        placeholder="اسم التصنيف الجديد"
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                    <button
                                        onClick={addCategory}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        إضافة
                                    </button>
                                </div>
                            </div>

                            {/* Add Medication Section */}
                            <div className="border p-4 rounded-lg">
                                <h4 className="font-bold mb-3">إضافة دواء جديد</h4>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newMedication.name}
                                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                                        placeholder="اسم الدواء"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    />
                                    <select
                                        value={newMedication.category_id}
                                        onChange={(e) => setNewMedication({ ...newMedication, category_id: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                    >
                                        <option value="">اختر التصنيف</option>
                                        {medicationsData?.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea
                                        value={newMedication.description}
                                        onChange={(e) => setNewMedication({ ...newMedication, description: e.target.value })}
                                        placeholder="وصف الدواء (اختياري)"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                        rows="2"
                                    />
                                    <button
                                        onClick={addMedicationToDB}
                                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        إضافة دواء
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowManageMedicationsModal(false)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}