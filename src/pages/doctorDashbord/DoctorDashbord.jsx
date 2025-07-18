import SideBar from "./components/SideBar";
import Topbar from "./components/Topbar";
import "./DoctorDashbord.css"
function DoctorDashboard() {
  return (
    <div className="doctor-dashboard">
      <SideBar className="sidebar" />
      <div className="dashboard-content">
        <Topbar className="topbar" />
      </div>
    </div>
  );
}

export default DoctorDashboard;