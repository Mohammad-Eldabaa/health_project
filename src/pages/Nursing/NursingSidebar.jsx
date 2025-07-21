import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserNurse } from "@fortawesome/free-solid-svg-icons";

const NursingSidebar = () => {
  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-info text-white sidebar collapse p-0"
      style={{minHeight: "100vh",backgroundColor: "#0097A7" }}
    >
      <div
        className="position-sticky pt-3"
      >
        <h2 className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white px-3">
          <FontAwesomeIcon icon={faUserNurse} className="me-2" />
          <span className="fs-4">لوحة التمريض</span>
        </h2>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto px-3">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-white"}`
              }
            >
              <i className="bi bi-speedometer2 me-2"></i>
              لوحة التحكم
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-appointment"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-white"}`
              }
            >
              <i className="bi bi-calendar-plus me-2"></i>
              إضافة موعد
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-white"}`
              }
            >
              <i className="bi bi-calendar-week me-2"></i>
              الجدول
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-white"}`
              }
            >
              <i className="bi bi-people me-2"></i>
              المرضى
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : "text-white"}`
              }
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              تسجيل الخروج
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NursingSidebar;
