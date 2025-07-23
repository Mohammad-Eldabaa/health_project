
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from '@mui/icons-material/Menu';
import "./TopBar.css";
import SearchBar from "./SearchBar";

function Topbar({ toggleSidebar }) {
    return (
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
                        src="https:cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User Avatar"
                        style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                    />
                    <span className="user-name">د/أحمد الصاوي</span>
                </span>
            </div>        </div>
    )
}

export default Topbar;
