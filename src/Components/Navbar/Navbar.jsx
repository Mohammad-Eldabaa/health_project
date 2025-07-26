import React, { useState } from 'react';
import logo from '../../assets/img/logo.png';
import { NavLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="shadow px-4 z-50 fixed top-0 left-0 w-screen"
        style={{ backgroundColor: 'var(--color-primary-dark)' }}
      >
        <div className="flex container flex-col lg:flex-row items-center justify-between mx-auto py-2 relative">
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
                paddingLeft: 60,
              }}
            >
              Clinic
              <img src={logo} width={35} height={35} alt="Logo" className="mx-2" />
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

          <div className="hidden lg:flex lg:items-center lg:justify-between w-full lg:w-auto">
            <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-10">
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
                    to="/"
                    onClick={handleNavClick}
                  >
                    الرئسية
                  </NavLink>
                </li>
                <li>
                  <ScrollLink
                    href="./home"
                    to="HAbout"
                    smooth={true}
                    duration={100}
                    offset={-70}
                    className="relative mx-3 text-lg text-white pb-1 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0
                    after:h-[2px] after:bg-white
                    after:transition-all after:duration-400 hover:after:w-full"
                    onClick={handleNavClick}
                  >
                    من نحن
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="HServices"
                    smooth={true}
                    duration={100}
                    offset={-70}
                    className="relative mx-3 text-lg text-white pb-1 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0
                    after:h-[2px] after:bg-white
                    after:transition-all after:duration-400 hover:after:w-full"
                    onClick={handleNavClick}
                  >
                    الخدمات
                  </ScrollLink>
                </li>
                <li>
                  <ScrollLink
                    to="HContact"
                    smooth={true}
                    duration={100}
                    offset={-70}
                    className="relative mx-3 text-lg text-white pb-1 cursor-pointer
                    after:content-[''] after:absolute after:left-0 after:bottom-0
                    after:h-[2px] after:bg-white
                    after:transition-all after:duration-400 hover:after:w-full"
                    onClick={handleNavClick}
                  >
                    اتصل بنا
                  </ScrollLink>
                </li>
              </ul>
            </div>
            <div>
              <ul className="flex flex-col lg:flex-row items-center mb-0">
                <li>
                  <NavLink className="mx-3 text-lg text-white" to={'login'} onClick={handleNavClick}>
                    <i className="fa-solid fa-right-to-bracket"></i> تسجيل الدخول
                  </NavLink>
                </li>
                <li
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    padding: '3px',
                    borderRadius: '5px',
                  }}
                >
                  <NavLink className="mx-3 text-lg text-white" to={'bookingpage'} onClick={handleNavClick}>
                    <i className="fa-solid fa-user-plus"></i> حجز موعد
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
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
                  to="/"
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `block text-lg py-3 px-2 rounded transition-colors ml-1 flex items-center ${
                      isActive ? 'bg-cyan-500 text-white' : 'text-white hover:bg-cyan-400'
                    }`
                  }
                >
                  <i className="fa-solid fa-home ml-3"></i> الرئسية
                </NavLink>
              </li>
              <li>
                <ScrollLink
                  to="HAbout"
                  smooth={true}
                  duration={100}
                  offset={-70}
                  onClick={handleNavClick}
                  className="block text-lg py-3 px-2 rounded ml-1 flex items-center text-white hover:bg-cyan-400 cursor-pointer"
                >
                  <i className="fa-solid fa-info-circle ml-3"></i> من نحن
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="HServices"
                  smooth={true}
                  duration={100}
                  offset={-70}
                  onClick={handleNavClick}
                  className="block text-lg py-3 px-2 rounded ml-1 flex items-center text-white hover:bg-cyan-400 cursor-pointer"
                >
                  <i className="fa-solid fa-stethoscope ml-3"></i> الخدمات
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="HContact"
                  smooth={true}
                  duration={100}
                  offset={-70}
                  onClick={handleNavClick}
                  className="block text-lg py-3 px-2 rounded ml-1 flex items-center text-white hover:bg-cyan-400 cursor-pointer"
                >
                  <i className="fa-solid fa-phone ml-3"></i> اتصل بنا
                </ScrollLink>
              </li>
            </ul>

            <div className="mt-auto">
              <ul className="flex flex-col space-y-4">
                <li>
                  <NavLink
                    to="login"
                    onClick={handleNavClick}
                    className="block text-lg py-3 px-2 rounded ml-1 flex items-center text-white hover:bg-cyan-400"
                  >
                    <i className="fa-solid fa-right-to-bracket ml-3"></i> تسجيل الدخول
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="booking"
                    onClick={handleNavClick}
                    className="block text-lg py-3 px-2 rounded ml-1 flex items-center text-white hover:bg-cyan-400"
                  >
                    <i className="fa-solid fa-user-plus ml-3"></i> حجز موعد
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
