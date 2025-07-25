import React from "react";
import { Stethoscope } from "lucide-react"; 
export function CurrentPatient() {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-primary">المريض الحالي</h3>
                <Stethoscope className="text-primary" />
            </div>

            <div className="bg-blue-100 rounded-lg p-2 mb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-800">أحمد محمد</h4>
                        <p className="text-gray-500 text-sm">35 سنة</p>
                    </div>
                    <span className="bg-primary  px-2 py-1 rounded text-sm">
                        قيد الكشف
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-bold text-gray-800 mb-2">الأعراض</h4>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                    <li>ألم في الصدر</li>
                    <li>صداع مستمر</li>
                    <li>دوخة</li>
                </ul>
            </div>

            <button className="w-full bg-accent text-white py-2 rounded hover:bg-opacity-90 transition" style={{
                backgroundColor: "var(--color-accent)"
            }}>
                فتح الملف الطبي الكامل
            </button>
        </>
    )
}
