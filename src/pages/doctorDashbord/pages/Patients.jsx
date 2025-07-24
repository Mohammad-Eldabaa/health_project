import { Eye, Pencil, Trash2 } from "lucide-react";
import SearchBar from "../components/SearchBar";

const patientsData = [
    { id: 1, name: "أحمد علي", age: 30, gender: "ذكر", phone: "0123456789", address: "القاهرة", lastVisit: "2025-07-10", status: "مستقر" },
    { id: 2, name: "محمد أحمد", age: 25, gender: "ذكر", phone: "0123456788", address: "الجيزة", lastVisit: "2025-07-09", status: "مستقر" },
    { id: 3, name: "سارة محمود", age: 28, gender: "أنثى", phone: "0123456787", address: "الإسكندرية", lastVisit: "2025-07-08", status: "حالة متوسطة" },
    { id: 4, name: "فاطمة خالد", age: 35, gender: "أنثى", phone: "0123456786", address: "المنصورة", lastVisit: "2025-07-07", status: "حالة حرجة" },
    { id: 5, name: "علي حسين", age: 40, gender: "ذكر", phone: "0123456785", address: "أسوان", lastVisit: "2025-07-06", status: "مستقر" },
];

const statusColor = {
    "مستقر": "bg-green-100 text-green-700",
    "حالة متوسطة": "bg-yellow-100 text-yellow-700",
    "حالة حرجة": "bg-red-100 text-red-700"
};

export default function Patients() {
    return (
        <div className="p-4 space-y-4" dir="rtl">
            <h2 className="text-2xl font-bold">المرضى</h2>

            <div className="bg-gray-100 p-4 rounded-2xl shadow-md">

                <SearchBar placeholder="ابحث بالاسم أو الرقم ..." className="max-w-md bg-white rounded-2xl " />

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-auto bg-white rounded-2xl shadow-md mt-3">
                    <table className="w-full text-right border-collapse ">
                        <thead>
                            <tr className="bg-white text-sm text-gray-600">
                                <th className="p-3">رقم</th>
                                <th className="p-3">الإسم</th>
                                <th className="p-3">العمر</th>
                                <th className="p-3">النوع</th>
                                <th className="p-3">رقم الهاتف</th>
                                <th className="p-3">العنوان</th>
                                <th className="p-3">آخر زيارة</th>
                                <th className="p-3">الحالة</th>
                                <th className="p-3">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientsData.map((p) => (
                                <tr key={p.id} className="border-t border-gray-200 text-sm">
                                    <td className="p-3">{p.id}</td>
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">{p.age}</td>
                                    <td className="p-3">{p.gender}</td>
                                    <td className="p-3">{p.phone}</td>
                                    <td className="p-3">{p.address}</td>
                                    <td className="p-3">{p.lastVisit}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-full"><Eye size={18} /></button>
                                        <button className="text-yellow-600 hover:bg-yellow-100 p-1 rounded-full"><Pencil size={18} /></button>
                                        <button className="text-red-600 hover:bg-red-100 p-1 rounded-full"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            {/* Mobile Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden  mt-3">
                {patientsData.map((p) => (
                    <div key={p.id} className="bg-white shadow rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold text-gray-600">#{p.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[p.status]}`}>{p.status}</span>
                        </div>
                        <div className="text-sm space-y-1">
                            <div><strong>الاسم:</strong> {p.name}</div>
                            <div><strong>العمر:</strong> {p.age}</div>
                            <div><strong>النوع:</strong> {p.gender}</div>
                            <div><strong>آخر زيارة:</strong> {p.lastVisit}</div>
                        </div>
                        <div className="flex justify-around pt-2 border-t border-gray-100">
                            <button className="text-blue-600 hover:bg-blue-100 p-1 rounded-full"><Eye size={18} /></button>
                            <button className="text-yellow-600 hover:bg-yellow-100 p-1 rounded-full"><Pencil size={18} /></button>
                            <button className="text-red-600 hover:bg-red-100 p-1 rounded-full"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
                        </div>

        </div>
    );
}
