import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserNurse,
  faBell,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const NursingNavbar = () => {
  // Sample nurse name (this could come from a context or auth system)
  const nurseName = "د. أحمد محمد";

  return (
    <nav
      className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-50"
      dir="rtl"
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="flex items-center space-x-2 space-x-reverse">
          <FontAwesomeIcon
            icon={faUserNurse}
            className="text-2xl text-cyan-100 hover:text-white transition-colors"
          />
          <NavLink
            to="/"
            className="text-xl font-bold text-white hover:text-cyan-100 transition-colors"
          >
            لوحة التمريض
          </NavLink>
        </div>

        {/* Navigation Links - Hidden on small screens */}
        <div className="hidden md:flex space-x-6 space-x-reverse">
          <NavLink
            to="/"
            className="text-white hover:text-cyan-100 transition-colors px-2 py-1 rounded hover:bg-cyan-700"
            activeClassName="bg-cyan-800"
          >
            الرئيسية
          </NavLink>
          <NavLink
            to="/patients"
            className="text-white hover:text-cyan-100 transition-colors px-2 py-1 rounded hover:bg-cyan-700"
            activeClassName="bg-cyan-800"
          >
            المرضى
          </NavLink>
          <NavLink
            to="/appointments"
            className="text-white hover:text-cyan-100 transition-colors px-2 py-1 rounded hover:bg-cyan-700"
            activeClassName="bg-cyan-800"
          >
            المواعيد
          </NavLink>
        </div>
      </div>

      {/* Right Section - Nurse Info and Actions */}
      <div className="flex items-center space-x-4 space-x-reverse">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-cyan-700 transition-colors">
          <FontAwesomeIcon icon={faBell} className="text-lg" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </button>

        {/* Nurse Profile */}
        <div className="flex items-center space-x-3 space-x-reverse group cursor-pointer">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-cyan-100 group-hover:text-white transition-colors">
              {nurseName}
            </span>
            <span className="text-xs text-cyan-100 group-hover:text-white transition-colors">
              ممرض رئيسي
            </span>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
              <span className="text-white font-bold text-sm">
                {nurseName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {/* Dropdown Arrow */}
            <svg
              className="w-4 h-4 absolute -left-2 top-3 text-cyan-100 group-hover:text-white transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>

        {/* Logout Button */}
        <button className="p-2 rounded-full hover:bg-cyan-700 transition-colors">
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="text-lg text-cyan-100 hover:text-white transition-colors"
          />
        </button>
      </div>
    </nav>
  );
};

export default NursingNavbar;
