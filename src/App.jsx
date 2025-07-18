import { BrowserRouter } from "react-router-dom";
import DoctorDashboard from './pages/doctorDashbord/DoctorDashbord';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <DoctorDashboard />
    </BrowserRouter>
  );
}

export default App;
