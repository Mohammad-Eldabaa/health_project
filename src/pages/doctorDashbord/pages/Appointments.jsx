
import { Clock, User, Stethoscope, Search, Frown } from "lucide-react";
import { useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { setupRealtimePatients } from "../../../lib/supabaseRealtime";
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import FilterListIcon from '@mui/icons-material/FilterList';


const Appointments = () => {
    const [activeTab, setActiveTab] = useState("today");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("الكل");


    const loading = useDoctorDashboardStore((state) => state.loading);
    const patients = useDoctorDashboardStore((state) => state.patients);
    const appointments = useDoctorDashboardStore((state) => state.appointments);

    useEffect(() => {
        const channel = setupRealtimePatients();
        return () => channel.unsubscribe();
    }, []);

    const today = new Date().toISOString().split("T")[0];

    if (loading) {
        return <div className="p-4 text-blue-600">جاري التحميل...</div>;
    }

    if (!appointments.length || !patients.length) {
        return <div className="p-4 text-red-600">لا توجد بيانات متاحة</div>;
    }

    const filteredAppointmentsByTab = appointments.filter((app) => {
        if (activeTab === "today") return app.date === today;
        if (activeTab === "upcoming") return app.date > today;
        if (activeTab === "past") return app.date < today;
        return false;
    });



    const filteredAppointments = filteredAppointmentsByTab
        .filter((app) => {
            if (statusFilter === "الكل") return true;
            return app.status === statusFilter;
        })
        .map((app) => {
            const patient = patients.find((p) => p.id === app.patient_id);
            return {
                id: app.id,
                patientName: patient?.fullName || "مريض غير معروف",
                phone: patient?.phoneNumber || "غير متوفر",
                date: app.date,
                time: new Date(`1970-01-01T${app.time}`).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                type: app.reason,
                status: app.status,
            };
        })
        .filter(
            (appointment) =>
                appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                appointment.phone.includes(searchQuery)
        );




    return (
        <div className="px-6  min-h-screen" dir="rtl">

            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3">
                    <span className="text-base sm:text-lg lg:text-xl">جدول المواعيد</span>
                </div>
            </div>


            <div className="bg-gray-100 rounded-lg shadow-sm p-4 mb-6">
                <div className=" flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex border-b pb-2 border-gray-200 w-full md:w-auto ">
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "today" ? "text-white  bg-cyan-500text-white  bg-cyan-500 rounded-2xl" : "text-gray-500"}`}
                            onClick={() => setActiveTab("today")}
                        >
                            اليوم
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "upcoming" ? "text-white  bg-cyan-500text-white  bg-cyan-500 rounded-2xl" : "text-gray-500"}`}
                            onClick={() => setActiveTab("upcoming")}
                        >
                            القادمة
                        </button>
                        <button
                            className={`px-4 py-2 font-medium ${activeTab === "past" ? "text-white  bg-cyan-500text-white  bg-cyan-500 rounded-2xl" : "text-gray-500"}`}
                            onClick={() => setActiveTab("past")}
                        >
                            السابقة
                        </button>
                    </div>

                    <div className="flex gap-2 min-w-full  md:min-w-0  lg:min-w-105 ">
                        <div className="relative min-w-[120px]  max-w-[200px]">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full appearance-none bg-white border border-gray-300 rounded-full px-5 py-2 text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                            >
                                <option value="الكل" className="bg-cyan-500">الكل</option>
                                <option value="تم">تم</option>
                                <option value="في الإنتظار">في الإنتظار</option>
                                <option value="ملغي">ملغي</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center pr-2">
                                <FilterListIcon />
                            </div>
                        </div>
                        <div className="relative w-full ">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400  " size={18} />
                            <input
                                type="text"
                                placeholder="ابحث باسم المريض أو رقم الهاتف"
                                className="bg-white w-full pl-10 pr-4 py-2 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent "
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>



                <div className=" rounded-lg  overflow-hidden mt-4 ">
                    {filteredAppointments.length > 0 ? (
                        <>


                            <div className="flex hidden md:block overflow-x-auto bg-white">
                                <table className="min-w-full divide-y divide-gray-100 rounded-2xl">
                                    <thead className="bg-gray-10">
                                        <tr>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المريض</th>
                                            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التاريخ/الوقت</th>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع الزيارة</th>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                                            <th className="px-5 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 ">
                                        {filteredAppointments.map((appointment) => (
                                            <tr key={appointment.id} className="hover:bg-gray-50 ">
                                                <td className="px-2 py-2 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-cyan-100 rounded-full flex items-center justify-center"
                                                        >
                                                            <User style={{ color: "var(--color-primary-dark)" }} size={18} />
                                                        </div>
                                                        <div className="mr-4">
                                                            <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                                            <div className="text-sm text-gray-500">{appointment.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-1 py-4 whitespace-nowrap">
                                                    <div className="flex text-sm text-gray-900 items-center">
                                                        {appointment.date}<br />{appointment.time}
                                                    </div>
                                                </td>
                                                <td className="px-1 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Stethoscope className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm text-gray-900">{appointment.type}</span>
                                                    </div>
                                                </td>
                                                <td className="px-1 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "في الإنتظار"
                                                            ? "bg-orange-100 text-yellow-800"
                                                            : appointment.status === "ملغي"
                                                                ? "bg-red-100 text-red-800"
                                                                : appointment.status === "قيد الكشف"
                                                                    ? "bg-yellow-200 text-yellow-900"
                                                                    : appointment.status === "تم"
                                                                        ? "bg-green-200 text-green-800"
                                                                        : "bg-gray-100 text-yellow-800"
                                                            }`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </td>
                                                <td className="px-1 py-1 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex">
                                                        <button className="text-blue-600 hover:text-blue-900  p-2 hover:bg-cyan-100 rounded-2xl">تفاصيل</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>



                            <div className="md:hidden space-y-4 ">
                                {filteredAppointments.map((appointment) => (
                                    <div key={appointment.id} className=" rounded-2xl p-4 shadow-sm bg-white">
                                        <div className="flex items-center gap-3 mb-2 justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-cyan-100 text-cyan-600 rounded-full h-10 w-10 flex items-center justify-center">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{appointment.patientName}</div>
                                                    <div className="text-sm text-gray-500">{appointment.phone}</div>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "في الإنتظار"
                                                    ? "bg-orange-100 text-yellow-800"
                                                    : appointment.status === "ملغي"
                                                        ? "bg-red-100 text-red-800"
                                                        : appointment.status === "قيد الكشف"
                                                            ? "bg-yellow-200 text-yellow-900"
                                                            : appointment.status === "تم"
                                                                ? "bg-green-200 text-green-800"
                                                                : "bg-gray-100 text-yellow-800"
                                                    }`}
                                            >
                                                {appointment.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-700 mb-1">
                                            <Clock className="inline mr-1 text-gray-400" size={14} />
                                            {appointment.date && `${appointment.date} - `}{appointment.time}
                                        </div>
                                        <div className="mb-1 flex justify-between ">
                                            <div className="text-sm text-gray-700 mb-1">
                                                <Stethoscope className="inline mr-1 text-gray-400" size={14} />
                                                {appointment.type}
                                            </div>

                                            <button className="text-teal-800 hover:text-teal-400 transition-colors">
                                                <VisibilityIcon fontSize="small" className="hover:scale-110 transition-transform" />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <Frown className="mx-auto text-gray-400" size={48} />
                            <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد مواعيد</h3>
                            <p className="mt-1 text-sm text-gray-500">لم يتم العثور على مواعيد تطابق معايير البحث.</p>
                        </div>
                    )}
                </div>
            </div>




            <div className="bg-gray-50 p-4 rounded-2xl shadow-sm mt-6">
                <h2 className="text-lg font-semibold mb-4">ملخص إحصائي</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm ">
                        <h3 className="text-sm font-medium text-blue-800 bg-blue-200 p-1 rounded-md">مواعيد اليوم</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1 ">{filteredAppointmentsByTab.length}</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm ">
                        <h3 className="text-sm font-medium text-green-800 bg-green-200 p-1 rounded-md">مواعيد مؤكدة</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {filteredAppointmentsByTab.filter(a => a.status === "تم").length}
                        </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm ">
                        <h3 className="text-sm font-medium text-yellow-800 bg-yellow-200 p-1 rounded-md">في الانتظار</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {filteredAppointmentsByTab.filter(a => a.status === "في الإنتظار").length}
                        </p>
                    </div>
                    <div className="bg-white p-2 rounded-lg shadow-sm ">
                        <h3 className="text-sm font-medium text-red-800 bg-red-200 p-1 rounded-md">مواعيد ملغاه</h3>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                            {filteredAppointmentsByTab.filter(a => a.status === "ملغي").length}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Appointments;
