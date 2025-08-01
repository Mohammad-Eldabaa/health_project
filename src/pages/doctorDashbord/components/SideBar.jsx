import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // Using react-helmet-async for better async support
import PropTypes from 'prop-types';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScienceIcon from '@mui/icons-material/Science';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/logo2.png';
import CloseIcon from '@mui/icons-material/Close';

import './SideBar.css';

function SideBar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  // Define SEO metadata based on the current route
  const getSeoMetadata = () => {
    const path = location.pathname;
    let title = 'لوحة تحكم الطبيب - Clinic Smart';
    let description = 'إدارة مواعيد الأطباء، المرضى، الروشتات، والإحصائيات بسهولة عبر لوحة تحكم Clinic Smart.';
    let keywords = 'لوحة تحكم طبيب, Clinic Smart, إدارة مواعيد, روشتات, مرضى, إحصائيات';

    switch (path) {
      case '/DoctorDashboard':
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

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
      <div className={`sidebar ${isOpen ? 'mobile open' : ''}`}>
        <div className="sidebar-header">
          <h3
            style={{
              fontFamily: 'var(--logo-font)',
              marginTop: 5,
              marginBottom: 0,
              color: 'var(--color-text-white)',
              letterSpacing: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            Clinic
            <img
              src={logo}
              width={35}
              height={35}
              alt="Logo"
              style={{
                margin: '0 1px',
                verticalAlign: 'middle',
                display: 'inline-block',
              }}
              className="mx-2"
            />
            Smart
          </h3>
          <button onClick={toggleSidebar} className="close-btn">
            <CloseIcon />
          </button>
        </div>

        <ul className="sidebar-list">
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard" end className="sidebar-link">
              <HomeIcon /> الرئيسية
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/profile" className="sidebar-link">
              <PersonIcon /> الملف الشخصي
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/appointments" className="sidebar-link">
              <EventIcon /> المواعيد
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/patients" className="sidebar-link">
              <GroupIcon /> المرضى
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/records" className="sidebar-link">
              <AssignmentIcon /> سجل المرضى
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/prescription" className="sidebar-link">
              <LocalHospitalIcon /> كتابة روشتة
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/tests" className="sidebar-link">
              <ScienceIcon /> التحاليل والفحوصات
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/statistics" className="sidebar-link">
              <BarChartIcon /> الإحصائيات
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/DoctorDashboard/settings" className="sidebar-link">
              <SettingsIcon /> الإعدادات
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}

// PropTypes for type checking
SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default SideBar;
