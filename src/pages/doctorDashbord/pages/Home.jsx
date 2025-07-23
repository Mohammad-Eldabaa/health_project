import { useNavigate } from "react-router-dom";
import CalendarView from '../components/CalendarView';


import {
    UserPlus,
    CalendarCheck,
    AlertCircle,
    Stethoscope,
    Bell,
} from "lucide-react";

const Home = () => {

    const navigate = useNavigate();

    const goToPatientFile = () => {
        navigate("./Appointments");
    };
    const appointments = [
        { id: 1, patient: "أحمد محمد", time: "09:00 ص", reason: "كشف دوري" },
        { id: 2, patient: "سارة علي", time: "10:30 ص", reason: "متابعة علاج" },
        { id: 3, patient: "محمد خالد", time: "12:00 م", reason: "استشارة" },
    ];

    const stats = [
        {
            title: "المرضى اليوم",
            value: 15,
            change: "+2",
            icon: <UserPlus className="text-blue-500" />,
        },
        {
            title: "المواعيد",
            value: 8,
            change: "+1",
            icon: <CalendarCheck className="text-green-500" />,
        },
        {
            title: "الحالات الطارئة",
            value: 2,
            change: "0",
            icon: <AlertCircle className="text-red-500" />,
        },
    ];

    return (
        <div className="min-h-screen ">
            <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3">
                <span className="text-base sm:text-lg lg:text-xl"> لوحة التحكم</span>
            </div>

            <div className="container mx-auto p-4 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8  ">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-gray-100 rounded-xl shadow p-6 flex items-center justify-between "
                        >
                            <div>
                                <h3 className="text-gray-500 text-sm">{stat.title}</h3>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-3xl font-bold text-gray-800">
                                        {stat.value}
                                    </span>
                                    <span className="text-green-600 text-sm">{stat.change}</span>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                                كشوفات اليوم
                            </h3>
                            <div className="flex space-x-2 space-x-reverse">
                                <button
                                    className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition flex items-center gap-2"
                                    onClick={goToPatientFile}
                                    style={{ backgroundColor: "var(--color-accent)" }}
                                >
                                    <span>عرض الكل</span>

                                </button>
                            </div>
                        </div>


                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow bg-white"
                                >
                                    <div className="flex justify-between items-start ">
                                        <div className="flex items-start space-x-3 space-x-reverse">
                                            <div
                                                className={`p-2 rounded-full ${appointment.status === "مؤكد"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-yellow-100 text-yellow-600"
                                                    }`}
                                            >
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">
                                                    {appointment.patient}
                                                </h4>
                                                <p className="text-gray-500 text-sm mt-1">
                                                    {appointment.reason}
                                                </p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">

                                                    <span>
                                                        {appointment.time} - {appointment.duration} دقيقة
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${appointment.status === "مؤكد"
                                                ? "bg-green-100 text-green-800"
                                                : appointment.status === "ملغى"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {appointment.status}
                                        </span>
                                    </div>

                                    <div className="flex space-x-2 space-x-reverse mt-4  ">
                                        <button className="text-sm  text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                                            style={{ backgroundColor: "var(--color-primary-light)" }}>

                                            الملف الطبي
                                        </button>
                                        <button className="text-sm  text-gray-600 px-3 py-1 rounded-lg hover:bg-primaryDark transition flex items-center gap-1
                                        "style={{ backgroundColor: "var(--color-primary-light)" }}>

                                            بدء الكشف
                                        </button>
                                        <button className="text-sm  text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition flex items-center gap-1"
                                            style={{ backgroundColor: "var(--color-primary-light)" }}>

                                            تعديل
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ملخص سريع */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex space-x-4 space-x-reverse">
                                <div className="flex items-center text-sm">
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span>
                                        مؤكد (
                                        {appointments.filter((a) => a.status === "مؤكد").length})
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    <span>
                                        في الانتظار (
                                        {
                                            appointments.filter((a) => a.status === "في الانتظار")
                                                .length
                                        }
                                        )
                                    </span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <span>
                                        ملغى (
                                        {appointments.filter((a) => a.status === "ملغى").length})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="">

                        <div className="bg-gray-100 rounded-xl shadow p-2 mb-6">
                            <CalendarView />
                        </div>
                        
                        <div className="bg-gray-100 rounded-xl shadow p-6">
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

                            <button className="w-full bg-accent text-white py-2 rounded hover:bg-opacity-90 transition"
                                style={{ backgroundColor: "var(--color-accent)" }}>
                                فتح الملف الطبي الكامل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
