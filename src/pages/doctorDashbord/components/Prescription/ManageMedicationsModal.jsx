import React from 'react';

const ManageMedicationsModal = ({
    show,
    onClose,
    medicationsData,
    newCategory,
    onNewCategoryChange,
    newMedication,
    onNewMedicationChange,
    onAddCategory,
    onAddMedication
}) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 overflow-auto bg-gray-500/60">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl border border-gray-200">
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--color-primary)" }}>
                    إدارة الأدوية والتصنيفات
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold mb-3">إضافة تصنيف جديد</h4>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => onNewCategoryChange(e.target.value)}
                                placeholder="اسم التصنيف الجديد"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                            />
                            <button
                                onClick={onAddCategory}
                                className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                            >
                                إضافة
                            </button>
                        </div>
                    </div>

                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold mb-3">إضافة دواء جديد</h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                value={newMedication.name}
                                onChange={(e) => onNewMedicationChange({...newMedication, name: e.target.value})}
                                placeholder="اسم الدواء"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                            />
                            <select
                                value={newMedication.category_id}
                                onChange={(e) => onNewMedicationChange({...newMedication, category_id: e.target.value})}
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
                                onChange={(e) => onNewMedicationChange({...newMedication, description: e.target.value})}
                                placeholder="وصف الدواء (اختياري)"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                                rows="2"
                            />
                            <button
                                onClick={onAddMedication}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
                            >
                                إضافة دواء
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageMedicationsModal;