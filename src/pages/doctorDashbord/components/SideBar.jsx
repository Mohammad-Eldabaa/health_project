import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ScienceIcon from "@mui/icons-material/Science";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

import "./SideBar.css";

function SideBar() {
    return (
        <div className="sidebar">
            <h2 className="logo-title">
                <LocalHospitalIcon style={{ fontSize: '30px', color: 'teal', marginLeft: '8px' }} />
                Smart Clinic
            </h2>
            <ul className="sidebar-list">
                <li className="sidebar-item"><HomeIcon /> الرئيسية</li>
                <li className="sidebar-item"><PersonIcon /> الملف الشخصي</li>
                <li className="sidebar-item"><EventIcon /> المواعيد</li>
                <li className="sidebar-item"><GroupIcon /> المرضى</li>
                <li className="sidebar-item"><AssignmentIcon /> سجل المرضى</li>
                <li className="sidebar-item"><LocalHospitalIcon /> كتابة روشتة</li>
                <li className="sidebar-item"><ScienceIcon /> التحاليل والفحوصات</li>
                <li className="sidebar-item"><BarChartIcon /> الإحصائيات</li>
                <li className="sidebar-item"><SettingsIcon /> الإعدادات</li>
            </ul>
        </div>
    );
}

export default SideBar;
