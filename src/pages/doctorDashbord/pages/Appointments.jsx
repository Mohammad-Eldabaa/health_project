import { Calendar, Clock, User, Stethoscope, Search, ChevronDown, Frown } from "lucide-react";
import { useState } from "react";

const Appointments = () => {
    const [activeTab, setActiveTab] = useState("today");
    const [searchQuery, setSearchQuery] = useState("");

    // بيانات المواعيد النموذجية
    const appointmentsData = {
        today: [
            {
                id: 1,
                patientName: "أحمد محمد",
                time: "09:00 ص",
                status: "مؤكد",
                type: "كشف جديد",
                phone: "0123456789",
            },
            {
                id: 2,
                patientName: "سارة علي",
                time: "10:30 ص",
                status: "مؤكد",
                type: "متابعة",
                phone: "0111222333",
            },
            {
                id: 3,
                patientName: "محمد خالد",
                time: "12:00 م",
                status: "في الانتظار",
                type: "استشارة",
                phone: "0100555666",
            },
        ],
        upcoming: [
            {
                id: 4,
                patientName: "فاطمة الزهراء",
                date: "غدًا",
                time: "10:00 ص",
                status: "مؤكد",
                type: "كشف جديد",
                phone: "0155777888",
            },
            {
                id: 5,
                patientName: "يوسف أحمد",
                date: "بعد غد",
                time: "11:30 ص",
                status: "مؤكد",
                type: "متابعة",
                phone: "0122333444",
            },
        ],
        past: [
            {
                id: 6,
                patientName: "نورا سعيد",
                date: "الأمس",
                time: "09:30 ص",
                status: "منتهي",
                type: "كشف دوري",
                phone: "0100111222",
            },
            {
                id: 7,
                patientName: "خالد عمر",
                date: "20 يوليو",
                time: "02:00 م",
                status: "منتهي",
                type: "استشارة",
                phone: "0123444555",
            },
        ],
    };

    // تصفية المواعيد حسب البحث
    const filteredAppointments = appointmentsData[activeTab].filter((appointment) =>
        appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.phone.includes(searchQuery)
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen" dir="rtl">
            {/* عنوان الصفحة */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={24} />
                    جدول المواعيد
                </h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    إضافة موعد جديد
                </button>
            </div>

            {/* شريط التبويبات والبحث */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex border-b border-gray-200 w-full md:w-auto">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "today" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => setActiveTab("today")}
                        >
                            اليوم
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "upcoming" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            القادمة
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "past" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                            onClick={() => setActiveTab("past")}
                        >
                            السابقة
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="ابحث باسم المريض أو رقم الهاتف"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* جدول المواعيد */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {filteredAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المريض</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ/الوقت</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع الزيارة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredAppointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="text-blue-600" size={18} />
                                                </div>
                                                <div className="mr-4">
                                                    <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                                    <div className="text-sm text-gray-500">{appointment.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {appointment.date && `${appointment.date} - `}{appointment.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Stethoscope className="text-gray-400 mr-2" size={16} />
                                                <span className="text-sm text-gray-900">{appointment.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === "مؤكد" ? "bg-green-100 text-green-800" :
                                                    appointment.status === "في الانتظار" ? "bg-yellow-100 text-yellow-800" :
                                                        "bg-gray-100 text-gray-800"
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <button className="text-blue-600 hover:text-blue-900">تفاصيل</button>
                                                <button className="text-gray-600 hover:text-gray-900">تعديل</button>
                                                {activeTab === "today" && appointment.status === "في الانتظار" && (
                                                    <button className="text-green-600 hover:text-green-900">تأكيد</button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <Frown className="mx-auto text-gray-400" size={48} />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد مواعيد</h3>
                        <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مواعيد تطابق معايير البحث.</p>
                    </div>
                )}
            </div>

            {/* إحصائيات سريعة */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500">مواعيد اليوم</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">3</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500">مواعيد مؤكدة</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">2</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <h3 className="text-sm font-medium text-gray-500">في الانتظار</h3>
                    <p className="text-2xl font-bold text-gray-800 mt-1">1</p>
                </div>
            </div>
        </div>
    );
};

export default Appointments;