import React, { useState, useEffect, useRef } from 'react';
import Style from './Navbar.module.css';
import logo from '../../assets/img/logo.png';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import ProfileModal from './ProfileModal';
import PatientMedicalRecord from './PatientMedicalRecord';


export default function Navbar() {
  const { CUname, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const [authDropdown, setAuthDropdown] = useState(false);
  const authDropdownRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNavClick = () => {
    setMenuOpen(false);
    setServicesDropdown(false);
  };

  const toggleServicesDropdown = e => {
    e.stopPropagation();
    setServicesDropdown(!servicesDropdown);
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdown(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)) {
        setServicesDropdown(false);
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
        setAuthDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav
        className="shadow px-7 z-50 fixed  top-0 left-0 w-screen"
        style={{ backgroundColor: 'var(--color-primary-dark)' }}
      >
        <div className="flex container flex-col lg:flex-row items-center justify-between mx-auto py-2 relative">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center justify-between gap-6 w-full lg:w-auto">
            <h3
              style={{
                fontFamily: 'var(--logo-font)',
                marginTop: 5,
                marginBottom: 0,
                color: 'var(--color-text-white)',
                letterSpacing: 2,
                display: 'flex',
                alignItems: 'center',
                fontSize: 24,
                paddingLeft: 30,
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

            <button
              className={`lg:hidden flex items-center py-2 text-white transition-all duration-700 transform ${
                menuOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
              } hover:scale-105`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
              style={{ fontSize: 28 }}
            >
              <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'} transition-all duration-400`}></i>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-between flex-1 lg:w-auto">
            <div className="flex flex-col lg:flex-row items-center m-auto gap-0 lg:gap-10">
              <ul className="flex flex-col lg:flex-row items-center pe-12 mb-0">
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `relative mx-3 text-lg text-white pb-1 
                      after:content-[''] after:absolute after:left-0 after:bottom-0 
                      after:h-[2px] after:bg-white 
                      after:transition-all after:duration-400 
                      ${isActive ? 'after:w-full' : 'after:w-0'}`
                    }
                    to={'/'}
                    onClick={handleNavClick}
                  >
                    الرئيسية
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `relative mx-3 text-lg text-white pb-1 
                      after:content-[''] after:absolute after:left-0 after:bottom-0 
                      after:h-[2px] after:bg-white 
                      after:transition-all after:duration-400 
                      ${isActive ? 'after:w-full' : 'after:w-0'}`
                    }
                    onClick={handleNavClick}
                  >
                    من نحن
                  </NavLink>
                </li>

                {/* Services Dropdown - Desktop */}
                <li className="relative" ref={dropdownRef}>
                  <div className="flex items-center">
                    <NavLink
                      to="/services"
                      className={({ isActive }) =>
                        `relative mx-3 text-lg text-white pb-1 
                        after:content-[''] after:absolute after:left-0 after:bottom-0 
                        after:h-[2px] after:bg-white 
                        after:transition-all after:duration-400 
                        ${isActive ? 'after:w-full' : 'after:w-0'}`
                      }
                      onClick={e => {
                        // يشتغل عند النقر على النص فقط
                        if (e.target.tagName === 'A') {
                          handleNavClick();
                        }
                      }}
                    >
                      الخدمات
                    </NavLink>
                    <button onClick={toggleServicesDropdown} className="text-white text-sm focus:outline-none ml-1">
                      <i
                        className={`fa-solid fa-chevron-${
                          servicesDropdown ? 'up' : 'down'
                        } transition-transform duration-300`}
                      ></i>
                    </button>
                  </div>

                  {servicesDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                      <div className="py-1">
                        <NavLink
                          to="/MedicalArticles"
                          className="block px-4 py-2 text-gray-800 hover:bg-[#E0F7FA] transition-colors"
                          onClick={handleNavClick}
                        >
                          <i className="fa-solid fa-book-medical me-2 mr-2 text-[#0097A7]"></i>
                          المقالات الطبية
                        </NavLink>
                        <NavLink
                          to="/FirstAid"
                          className="block px-4 py-2 text-gray-800 hover:bg-[#E0F7FA] transition-colors"
                          onClick={handleNavClick}
                        >
                          <i className="fa-solid fa-kit-medical me-2 mr-2 text-[#0097A7]"></i>
                          الإسعافات الأولية
                        </NavLink>
                      </div>
                    </div>
                  )}
                </li>

                <li>
                  <NavLink
                    className={({ isActive }) =>
                      `relative mx-3 text-lg text-white pb-1 
                      after:content-[''] after:absolute after:left-0 after:bottom-0 
                      after:h-[2px] after:bg-white 
                      after:transition-all after:duration-400 
                      ${isActive ? 'after:w-full' : 'after:w-0'}`
                    }
                    to={'/contact'}
                    onClick={handleNavClick}
                  >
                    اتصل بنا
                  </NavLink>
                </li>
              </ul>
              <div>
  <NavLink
    className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
    to="/patient-record"
    onClick={handleNavClick}
  >
    <i className="fa-solid fa-file-medical ml-3"></i>
    السجل المرضي
  </NavLink>
</div>

            </div>
            <div>
              <ul className="flex flex-col lg:flex-row items-center mb-0">
                <li className="relative" ref={authDropdownRef}>
                  <button
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      padding: '8px',
                      borderRadius: '5px',
                    }}
                    onClick={() => setAuthDropdown(prev => !prev)}
                    className="mx-3 text-lg text-white flex items-center gap-1"
                    aria-label="Account"
                  >
                    <i className="fa-solid fa-gear"></i>
                    {/* <i className={`fa-solid fa-chevron-${authDropdown ? 'up' : 'down'} ml-1`}></i> */}
                  </button>

                  {authDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-100">
                      <div className="py-1">
                        {CUname() ? (
                          <div>
                            <NavLink
                              to="/login"
                              onClick={e => {
                                e.preventDefault();
                                setIsModalOpen(true);
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              <i className="fa-solid fa-user me-2"></i>
                              الملف الشخصي
                            </NavLink>

                            <NavLink
                              to="/login"
                              onClick={() => {
                                logout();
                                setAuthDropdown(false);
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              <i className="fa-solid fa-right-to-bracket me-2"></i>
                              تسجيل الخروج
                            </NavLink>

                            <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                          </div>
                        ) : (
                          <NavLink
                            to="/login"
                            onClick={() => {
                              handleNavClick();
                              setAuthDropdown(false);
                            }}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          >
                            <i className="fa-solid fa-right-to-bracket me-2"></i>
                            تسجيل الدخول
                          </NavLink>

                        )}
                      </div>
                    </div>
                  )}
                </li>

                <li
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    padding: '3px',
                    borderRadius: '5px',
                  }}
                >
                  <NavLink className="mx-3 text-lg text-white" to={'/bookingpage'} onClick={handleNavClick}>
                    <i className="fa-solid fa-user-plus"></i> حجز موعد
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 z-50 lg:hidden
          transform transition-transform duration-600 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: 'var(--color-primary-dark)' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4 border-b border-gray-600">
            <button className="text-white text-2xl" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div className="flex flex-col flex-grow px-4 py-6">
            <ul className="flex flex-col space-y-4 mb-8">
              <li>
                <NavLink
                  className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                  to={'/'}
                  onClick={handleNavClick}
                >
                  <i className="fa-solid fa-home ml-3"></i>
                  الرئيسية
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                  to={'/about'}
                  onClick={handleNavClick}
                >
                  <i className="fa-solid fa-info-circle ml-3"></i>
                  من نحن
                </NavLink>
              </li>

              {/* Mobile Services Dropdown */}
              {/* Mobile Services Dropdown */}
              <li>
                <div className="flex justify-between items-center">
                  {/* نخلي العنوان ده مجرد span علشان ما يمنعش التنقل */}
                  <span
                    className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors w-full cursor-pointer"
                    onClick={() => setServicesDropdown(!servicesDropdown)}
                  >
                    <i className="fa-solid fa-stethoscope ml-3"></i>
                    الخدمات
                  </span>

                  <button onClick={() => setServicesDropdown(!servicesDropdown)} className="text-white px-3">
                    <i
                      className={`fa-solid fa-chevron-${
                        servicesDropdown ? 'up' : 'down'
                      } transition-transform duration-300`}
                    ></i>
                  </button>
                </div>

                {/* العناصر الداخلية داخل Dropdown */}
                {servicesDropdown && (
                  <div className="pl-4 mt-2 space-y-2">
                    <NavLink
                      to="/firstaid"
                      className="block text-lg text-white py-2 px-2 rounded hover:bg-cyan-500 transition-colors"
                      onClick={handleNavClick}
                    >
                      <i className="fa-solid fa-book-medical ml-3"></i>
                      المقالات الطبية
                    </NavLink>
                    <NavLink
                      to="/firstaid"
                      className="block text-lg text-white py-2 px-2 rounded hover:bg-cyan-500 transition-colors"
                      onClick={handleNavClick}
                    >
                      <i className="fa-solid fa-kit-medical ml-3"></i>
                      الإسعافات الأولية
                    </NavLink>
                  </div>
                )}
              </li>

              <li>
                <NavLink
                  className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                  to={'/contact'}
                  onClick={handleNavClick}
                >
                  <i className="fa-solid fa-phone ml-3"></i>
                  اتصل بنا
                </NavLink>
              </li>
            </ul>

            <div className="mt-auto">
              <ul className="flex flex-col space-y-4">
                <li>
                  {CUname() ? (
                    <div>
                      <div>
                        <NavLink
                          className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                          to="/login"
                          onClick={logout}
                        >
                          <i className="fa-solid fa-right-to-bracket ml-3"></i>
                          تسجيل الخروج
                        </NavLink>
                      </div>

                      <div>
                        <NavLink
                          className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                          to="/login"
                          onClick={e => {
                            e.preventDefault();
                            setIsModalOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-user ml-3"></i>
                          الملف الشخصي
                        </NavLink>
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      className="block text-lg text-white py-3 px-2 rounded hover:bg-cyan-400 transition-colors"
                      to={'/login'}
                      onClick={handleNavClick}
                    >
                      <i className="fa-solid fa-right-to-bracket ml-3"></i>
                      تسجيل الدخول
                    </NavLink>
                  )}
                </li>
                <li>
                  <NavLink
                    className="block text-lg hover:bg-cyan-400 text-white py-3 px-2 rounded transition-colors"
                    to={'/booking'}
                    onClick={handleNavClick}
                    style={{ borderRadius: '8px' }}
                  >
                    <i className="fa-solid fa-user-plus ml-3"></i>
                    حجز موعد
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* End Mobile Menu */}
    </>
  );
}
