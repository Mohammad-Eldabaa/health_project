import PersonInfo from "../components/PersonInfo";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PrescriptionModel from "./PrescriptionModel";
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

export default function Records() {
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);

    return (
        <>
            <PrescriptionModel isOpen={isPrescriptionOpen} onClose={() => setIsPrescriptionOpen(false)} />

            <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 px-4">

                <div className="flex justify-between items-center mb-3 gap-2">
                    <div className="flex items-center gap-3 justify-between">
                        <span className="text-base sm:text-lg lg:text-xl">سجل المريض</span>
                    </div>
                    <button
                        className="flex items-center gap-1 text-white rounded-md px-3 py-1.5 hover:bg-blue-600 transition text-xs sm:text-sm"
                        style={{ backgroundColor: "var(--color-accent)" }}
                        onClick={() => setIsPrescriptionOpen(true)}
                    >
                        <AddIcon fontSize="small" />
                        <span>روشتة جديدة</span>
                    </button>
                </div>


                <div className="flex flex-col lg:flex-row gap-5 ">

                    <div className="flex-1 min-w-0 bg-gray-50 rounded-2xl p-3 lg:w-3/5 ">
                        <PersonInfo compactMode={true} />
                    </div>

                    <div className="flex flex-col gap-3 lg:w-2/5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-gray-100 rounded-xl p-3">
                                <h2 className="text-sm font-bold mb-2 text-gray-800">الأمراض المزمنة</h2>
                                <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                                    <li className="truncate">• ارتفاع ضغط الدم</li>
                                    <li className="truncate">• السكري</li>
                                    <li className="truncate">• الربو</li>
                                </ul>
                            </div>

                            <div className="bg-gray-100 rounded-xl p-3">
                                <h2 className="text-sm font-bold mb-2 text-gray-800">التحاليل والفحوصات</h2>
                                <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                                    <li className="truncate">• تحليل دم شامل - 15/04/2024</li>
                                    <li className="truncate">• رسم قلب - 28/06/2024</li>
                                </ul>
                            </div>
                        </div>


                        <div className="bg-gray-100 rounded-xl p-3">
                            <h2 className="text-sm font-bold mb-2 text-gray-800">الأدوية الحالية</h2>
                            <ul className="space-y-1 text-gray-700 text-xs sm:text-sm">
                                <li className="truncate">• ليسِنوبريل</li>
                                <li className="truncate">• جهاز استنشاق الربو</li>
                                <li className="truncate">• دواء الغدة الدرقية</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-gray-100 rounded-2xl mx-5 sm:mx-6 my-3 p-3 sm:p-5 flex flex-col gap-3 sm:gap-5 mt-10 ">
                <h3 className="text-base sm:text-lg font-semibold m-0">الزيارات السابقة</h3>

                {/* Desktop Table */}
                <div className="hidden sm:block overflow-auto bg-white rounded-2xl shadow-md ">
                    <table className="w-full text-right border-collapse">
                        <thead >
                            <tr className="bg-white text-sm text-gray-700 text-center">
                                <th className="p-3 text-gray-700 font-medium border-b border-gray-200">رقم الزيارة</th>
                                <th className="p-3 text-gray-700 font-medium border-b border-gray-200">الإسم</th>
                                <th className="p-3 text-gray-700 font-medium border-b border-gray-200">تاريخ الزيارة</th>
                                <th className="p-3 text-gray-700 font-medium border-b border-gray-200">الحالة</th>
                                <th className="p-3 text-gray-700 font-medium border-b border-gray-200">عرض</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array(5).fill().map((_, index) => (
                                <tr key={index} className="hover:bg-gray-50 bg-white text-center">
                                    <td className="p-3 border-b border-gray-100 text-gray-600">{index + 1}</td>
                                    <td className="p-3 border-b border-gray-100 text-gray-600">أحمد علي</td>
                                    <td className="p-3 border-b border-gray-100 text-gray-600">2025-07-10</td>
                                    <td className="p-3 border-b border-gray-100">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            مستقر
                                        </span>
                                    </td>
                                    <td className="p-3 border-b border-gray-100">
                                        <button className="text-cyan-500 hover:text-cyan-700 transition-colors">
                                            <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>



                {/* Mobile Cards */}
                <div className="sm:hidden space-y-3">
                    {Array(5).fill().map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl p-3 shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold">الزيارة #{index + 1}</p>
                                    <p className="text-sm">أحمد علي</p>
                                </div>
                                <button className="bg-cyan-500 text-white p-1 rounded hover:bg-cyan-600 transition">
                                    <VisibilityIcon fontSize="small" />
                                </button>
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <span>2025-07-10</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">مستقر</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}