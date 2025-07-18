import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import "./TopBar.css"

function Topbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        // console.log("Searching for:", e.target.value);
    };
    return (
        <div className="topbar">
            <input
                className="search-input"
                type="text"
                placeholder="ابحث هنا ...."
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <div className="topbar-icons">
                <NotificationsIcon fontSize="large" className="notifications-icon" />
                <SettingsApplicationsIcon fontSize="large"  className="settings-icon" />
                <span className="user-info">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        alt="User Avatar"
                        style={{ width: "35px", height: "35px", borderRadius: "50%" }}
                    />
                    <span className="user-name">د/أحمد الصاوي</span>
                </span>
            </div>
        </div>
    );
}
export default Topbar;
