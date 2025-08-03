import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faUsers, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../supaBase/NursingBooking';

const NursingSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed on mobile
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }
      localStorage.removeItem('auth_token');
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 p-2 rounded-md bg-cyan-700 text-white hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="تفعيل القائمة الجانبية"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
      <nav
        id="sidebarMenu"
        className={`
          ${isMobile ? (isCollapsed ? 'w-0' : 'w-64') : 'w-64 md:w-20 lg:w-64'}
          bg-cyan-700 text-white
          h-screen
          fixed top-0 right-0
          z-40
          p-4
          transition-all duration-300 ease-in-out
          overflow-hidden
          ${isMobile && isCollapsed ? 'translate-x-full' : 'translate-x-0'}
          dir-rtl
        `}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2
              className={`flex items-center text-white text-lg font-medium ${
                isMobile || !isCollapsed ? 'block' : 'hidden md:block'
              }`}
            >
              <FontAwesomeIcon icon={faUserNurse} className="ml-2" />
              <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>لوحة التمريض</span>
            </h2>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-white p-1 rounded hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="إغلاق القائمة الجانبية"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>

          <hr className="border-white opacity-30 mx-2 mb-4" />
          <ul className="flex flex-col gap-2 px-2 flex-grow">
            <li>
              <NavLink
                to="/nursing-dashboard"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                  } ${isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'}`
                }
              >
                <i className="bi bi-speedometer2 ml-2"></i>
                <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>لوحة التحكم</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/nursing-dashboard/patients"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                  } ${isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'}`
                }
              >
                <FontAwesomeIcon icon={faUsers} className="ml-2" />
                <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>قائمة المرضى</span>
              </NavLink>
            </li>
            <li className="mt-auto">
              <button
                onClick={() => {
                  handleLogout();
                  closeSidebar();
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-white hover:bg-cyan-600 bg-transparent ${
                  isMobile || !isCollapsed ? 'justify-start' : 'justify-center md:justify-start'
                }`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
                <span className={`${isMobile || !isCollapsed ? 'block' : 'hidden md:block'}`}>تسجيل الخروج</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      {isMobile && !isCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30" onClick={closeSidebar} aria-hidden="true"></div>
      )}
    </>
  );
};

export default NursingSidebar;
