import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse, faUsers, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { supabase } from '../../supaBase/booking';

const NursingSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error.message);
        return;
      }

      // Clear local storage (in case token is stored there)
      localStorage.removeItem('auth_token'); // Adjust key if different

      // Redirect to home page
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during logout:', err);
    }
  };

  return (
    <nav
      id="sidebarMenu"
      className={`${
        isCollapsed && isMobile ? 'w-16' : 'w-full md:w-64'
      } bg-cyan-700 text-white h-full md:min-h-screen p-4 transition-all duration-300 ease-in-out`}
    >
      <div className="sticky top-0 pt-4">
        <div className="flex justify-between items-center mb-4 px-2">
          {!isCollapsed && (
            <h2 className="flex items-center text-white text-lg font-medium">
              <FontAwesomeIcon icon={faUserNurse} className="mr-2" />
              <span>لوحة التمريض</span>
            </h2>
          )}
          {isMobile && (
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-white p-1 rounded hover:bg-cyan-600">
              {isCollapsed ? <i className="bi bi-chevron-right"></i> : <i className="bi bi-chevron-left"></i>}
            </button>
          )}
        </div>

        {!isCollapsed && (
          <>
            <hr className="border-white opacity-30 mx-2 mb-4" />
            <ul className="flex flex-col gap-2 px-2">
              <li>
                <NavLink
                  to="/nursing-dashboard"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                    }`
                  }
                >
                  <i className="bi bi-speedometer2 mr-2"></i>
                  لوحة التحكم
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/nursing-dashboard/patients"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                    }`
                  }
                >
                  <FontAwesomeIcon icon={faUsers} className="mr-2" />
                  قائمة المرضى
                </NavLink>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 text-white hover:bg-cyan-600 bg-transparent"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  تسجيل الخروج
                </button>
              </li>
            </ul>
          </>
        )}

        {isCollapsed && (
          <ul className="flex flex-col gap-2 px-0">
            <li>
              <NavLink
                to="/nursing-dashboard"
                className={({ isActive }) =>
                  `flex justify-center p-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                  }`
                }
                title="لوحة التحكم"
              >
                <i className="bi bi-speedometer2"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/nursing-dashboard/patients"
                className={({ isActive }) =>
                  `flex justify-center p-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600 bg-transparent'
                  }`
                }
                title="قائمة المرضى"
              >
                <FontAwesomeIcon icon={faUsers} />
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex justify-center p-2 rounded-md text-sm font-medium transition-all duration-200 text-white hover:bg-cyan-600 bg-transparent"
                title="تسجيل الخروج"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NursingSidebar;
