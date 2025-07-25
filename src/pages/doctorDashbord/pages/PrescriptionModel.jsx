// src/pages/doctorDashboard/PrescriptionModel.jsx
import { useEffect, useState } from "react";

export default function PrescriptionModel({ isOpen, onClose, selectedPatient }) {
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (selectedPatient?.name) {
      setPatientName(selectedPatient.name);
    }
  }, [selectedPatient]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">روشتة جديدة</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600 text-xl">&times;</button>
        </div>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">اسم المريض</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            />
          </div>

          {/* تقدر تضيف باقي الحقول هنا زي الأدوية، التاريخ، التشخيص... */}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            حفظ الروشتة
          </button>
        </form>
      </div>
    </div>
  );
}
