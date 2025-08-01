import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet'; // Using react-helmet for better async support
import SideBar from '../components/SideBar';
import Topbar from '../components/Topbar';
import './DoctorDashbord.css';

import Home from './Home';
import Profile from './Profile';
import Appointments from './Appointments';
import Patients from './Patients';
import Records from './Records';
import Prescription from './Prescription';
import Tests from './Tests';
import Statistics from './Statistics';
import Settings from './Settings';

function DoctorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Define SEO metadata based on the current route
  const getSeoMetadata = () => {
    const path = location.pathname;
    let title = 'لوحة تحكم الطبيب - Clinic Smart';
    let description = 'إدارة مواعيد الأطباء، المرضى، الروشتات، والإحصائيات بسهولة عبر لوحة تحكم Clinic Smart.';
    let keywords = 'لوحة تحكم طبيب, Clinic Smart, إدارة مواعيد, روشتات, مرضى, إحصائيات';

    switch (path) {
      case '/DoctorDashboard':
      case '/DoctorDashboard/':
        title = 'الرئيسية - لوحة تحكم الطبيب';
        description = 'الصفحة الرئيسية للوحة تحكم الطبيب لإدارة الأنشطة اليومية.';
        keywords += ', الرئيسية';
        break;
      case '/DoctorDashboard/profile':
        title = 'الملف الشخصي - لوحة تحكم الطبيب';
        description = 'عرض وتعديل الملف الشخصي للطبيب في Clinic Smart.';
        keywords += ', ملف شخصي';
        break;
      case '/DoctorDashboard/appointments':
        title = 'المواعيد - لوحة تحكم الطبيب';
        description = 'إدارة مواعيد المرضى وحجوزات العيادة.';
        keywords += ', مواعيد, حجوزات';
        break;
      case '/DoctorDashboard/patients':
        title = 'المرضى - لوحة تحكم الطبيب';
        description = 'عرض وإدارة قائمة المرضى في Clinic Smart.';
        keywords += ', مرضى';
        break;
      case '/DoctorDashboard/records':
        title = 'سجل المرضى - لوحة تحكم الطبيب';
        description = 'الاطلاع على سجلات المرضى الطبية وتحديثها.';
        keywords += ', سجل مرضى';
        break;
      case '/DoctorDashboard/prescription':
        title = 'كتابة روشتة - لوحة تحكم الطبيب';
        description = 'كتابة وإدارة الروشتات الطبية للمرضى.';
        keywords += ', روشتة, وصفة طبية';
        break;
      case '/DoctorDashboard/tests':
        title = 'التحاليل والفحوصات - لوحة تحكم الطبيب';
        description = 'إدارة طلبات التحاليل والفحوصات الطبية.';
        keywords += ', تحاليل, فحوصات';
        break;
      case '/DoctorDashboard/statistics':
        title = 'الإحصائيات - لوحة تحكم الطبيب';
        description = 'عرض الإحصائيات والتقارير المتعلقة بالعيادة.';
        keywords += ', إحصائيات, تقارير';
        break;
      case '/DoctorDashboard/settings':
        title = 'الإعدادات - لوحة تحكم الطبيب';
        description = 'تخصيص إعدادات لوحة تحكم الطبيب في Clinic Smart.';
        keywords += ', إعدادات';
        break;
      default:
        break;
    }

    return { title, description, keywords };
  };

  const { title, description, keywords } = getSeoMetadata();

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="robots" content="noindex" /> {/* Private dashboard, not indexed */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <div className="doctor-dashboard">
        <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="content">
          <Topbar toggleSidebar={toggleSidebar} />
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="patients" element={<Patients />} />
            <Route path="records" element={<Records />} />
            <Route path="prescription" element={<Prescription />} />
            <Route path="tests" element={<Tests />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
