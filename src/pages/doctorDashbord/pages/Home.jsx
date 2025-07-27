
import useDoctorDashboardStore from "../../../store/doctorDashboardStore";
import { useEffect } from "react";

import { CurrentPatient } from '../components/CurrentPatient';
import { AppointmentSummary } from '../components/AppointmentSummary';
import { AppointmentList } from '../components/AppointmentList';
import { StatsCards } from '../components/StatsCards';
import { useNavigate } from "react-router-dom";
import { CalendarView } from '../components/CalendarView';

import {
    UserPlus,
    CalendarCheck,
    AlertCircle,
} from "lucide-react";




const Home = () => {
    const navigate = useNavigate();
    const goToPatientFile = () => navigate("./Appointments");

    const {
        appointments,
        patients,
        loading,
        fetchData,
    } = useDoctorDashboardStore();

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-4 text-blue-600">جاري التحميل...</div>;
    }

    if (!appointments.length || !patients.length) {
        return <div className="p-4 text-red-600">لا توجد بيانات متاحة</div>;
    }

    const todayAppointments = appointments
        .filter(app => app.date.startsWith(today))
        .map(app => {
            const patient = patients.find(p => p.id === app.patient_id);
            return {
                id: app.id,
                patient: patient?.fullName || "مريض غير معروف",
                time: new Date(`1970-01-01T${app.time}`).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",

                }),

                reason: app.reason,
                status: app.status,
            };
        });

    console.log(todayAppointments);


    const stats = [
        {
            title: "المرضى اليوم",
            value: todayAppointments.length,
            icon: <UserPlus className="text-blue-500" />,
        },
        {
            title: "المواعيد",
            value: appointments.length,
            icon: <CalendarCheck className="text-green-500" />,
        },
        {
            title: "الحالات الطارئة",
            value: patients.filter(p => p.status === "حالة حرجة").length,
            icon: <AlertCircle className="text-red-500" />,
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="flex flex-col font-bold mx-2 sm:mx-4 lg:mx-6 my-3 ">
                <span className="text-base sm:text-lg lg:text-xl">لوحة التحكم</span>
            </div>

            <div className="container mx-auto p-4">
                <StatsCards stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-100 rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-bold text-gray-800">كشوفات اليوم</h3>
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

                        <AppointmentList appointmentss={todayAppointments} />
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <AppointmentSummary appointments={todayAppointments} />
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-100 rounded-xl shadow p-6 mb-6">
                            <CurrentPatient />
                        </div>

                        <div className="bg-gray-100 rounded-xl shadow p-3 ">
                            <CalendarView />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
