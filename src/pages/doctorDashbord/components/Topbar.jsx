import { Helmet } from 'react-helmet-async'; // Using react-helmet-async for better async support
import PropTypes from 'prop-types';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import SearchBar from './SearchBar';
import './TopBar.css';

function Topbar({ toggleSidebar }) {
  const userName = 'د/أحمد الصاوي'; // Hardcoded for now, could be dynamic from context or props

  // SEO metadata
  const pageTitle = `لوحة تحكم الطبيب - ${userName}`;
  const seoDescription = `لوحة تحكم الطبيب لـ ${userName} لإدارة المواعيد، المرضى، والإحصائيات باستخدام Clinic Smart.`;
  const seoKeywords = `لوحة تحكم طبيب, ${userName}, Clinic Smart, إدارة مواعيد, مرضى, إحصائيات`;

  return (
    <>
      {/* SEO Metadata with Helmet */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="robots" content="noindex" /> {/* Private dashboard, not indexed */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={seoDescription} />
      </Helmet>

      <div className="topbar">
        <button className="burger-btn" onClick={toggleSidebar}>
          <MenuIcon />
        </button>
        <SearchBar placeholder="ابحث هنا ...." />

        <div className="topbar-icons">
          <NotificationsIcon fontSize="large" className="notifications-icon" />
          <SettingsApplicationsIcon fontSize="large" className="settings-icon" />
          <span className="user-info">
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              alt="User Avatar"
              style={{ width: '35px', height: '35px', borderRadius: '50%' }}
            />
            <span className="user-name">{userName}</span>
          </span>
        </div>
      </div>
    </>
  );
}

// PropTypes for type checking
Topbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Topbar;
