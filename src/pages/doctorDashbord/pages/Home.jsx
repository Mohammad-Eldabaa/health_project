// compnents
import { CurrentPatient } from '../components/CurrentPatient';
import { AppointmentSummary } from '../components/AppointmentSummary';
import { AppointmentList } from '../components/AppointmentList';
import { StatsCards } from '../components/StatsCards';
import { useNavigate } from "react-router-dom";
import { CalendarView } from '../components/CalendarView';

// icons
import {
    UserPlus,
    CalendarCheck,
    AlertCircle,
} from "lucide-react";


// Appoinements navigator
const Home = () => {
    const navigate = useNavigate();
    const goToPatientFile = () => {
        navigate("./Appointments");
    };



    const appointments = [
        { id: 1, patient: "أحمد محمد", time: "09:00 ص", reason: "كشف دوري", status: "مؤكد" },
        { id: 2, patient: "سارة علي", time: "10:30 ص", reason: "متابعة علاج", status: "مؤكد" },
        { id: 3, patient: "محمد خالد", time: "12:00 م", reason: "استشارة", status: "ملغى" },
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
            <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 ">
                <span className="text-base sm:text-lg lg:text-xl "> لوحة التحكم</span>
            </div>
            <div className="container mx-auto p-4 ">
                <StatsCards stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                                كشوفات اليوم
                            </h3>
                            <div className="flex space-x-2 space-x-reverse">
                                <button
                                    className="bg-accent text-white px-4 py-2 rounded-2xl hover:bg-opacity-90 transition flex items-center gap-2"
                                    onClick={goToPatientFile}
                                    style={{ backgroundColor: "var(--color-accent)" }}
                                >
                                    <span>عرض الكل</span>
                                </button>
                            </div>
                        </div>
                        <AppointmentList appointments={appointments} />
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <AppointmentSummary appointments={appointments} />
                        </div>
                    </div>
                    
                    <div >
                        <div className="bg-gray-100 rounded-xl shadow p-2 mb-6">
                            <CalendarView />
                        </div>

                        <div className="bg-gray-100 rounded-xl shadow p-6">
                            <CurrentPatient />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
