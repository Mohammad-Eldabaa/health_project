import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNurse } from '@fortawesome/free-solid-svg-icons';

const NursingSidebar = () => {
  return (
    <nav id="sidebarMenu" className="w-full md:w-1/4 lg:w-1/5 bg-cyan-700 text-white min-h-screen p-0">
      <div className="sticky top-0 pt-6">
        <h2 className="flex items-center mb-6 px-4 text-white text-xl font-medium">
          <FontAwesomeIcon icon={faUserNurse} className="me-2 mr-2" />
          <span>لوحة التمريض</span>
        </h2>
        <hr className="border-white opacity-30 mx-4 mb-4" />
        <ul className="flex flex-col gap-3 px-4">
          <li>
            <NavLink
              to="/nursing-dashboard"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600'
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
                `block px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600'
                }`
              }
            >
              <i className="bi bi-people mr-2"></i>
              المرضى
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-white text-cyan-700' : 'text-white hover:bg-cyan-600'
                }`
              }
            >
              <i className="bi bi-box-arrow-right mr-2"></i>
              تسجيل الخروج
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NursingSidebar;