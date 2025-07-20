import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceIcon from "@mui/icons-material/Science";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo2.png";

import "./SideBar.css";

function SideBar() {
    return (
        <div className="sidebar">
            <h3
                style={{
                    fontFamily: "var(--logo-font)",
                    marginTop: 5,
                    marginBottom: 0,
                    color: "var(--color-text-white)",
                    letterSpacing: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                        margin: "0 1px",
                        verticalAlign: "middle",
                        display: "inline-block",
                    }}
                    className="mx-2"
                />
                Smart
            </h3>

            <ul className="sidebar-list">
                <li className="sidebar-item">
                    <NavLink to="/" className="sidebar-link">
                        <HomeIcon /> الرئيسية
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/profile" className="sidebar-link">
                        <PersonIcon /> الملف الشخصي
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/appointments" className="sidebar-link">
                        <EventIcon /> المواعيد
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/patients" className="sidebar-link">
                        <GroupIcon /> المرضى
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/records" className="sidebar-link">
                        <AssignmentIcon /> سجل المرضى
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/prescription" className="sidebar-link">
                        <LocalHospitalIcon /> كتابة روشتة
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/tests" className="sidebar-link">
                        <ScienceIcon /> التحاليل والفحوصات
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/statistics" className="sidebar-link">
                        <BarChartIcon /> الإحصائيات
                    </NavLink>
                </li>
                <li className="sidebar-item">
                    <NavLink to="/settings" className="sidebar-link">
                        <SettingsIcon /> الإعدادات
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default SideBar;
