import { BrowserRouter } from "react-router-dom";
import DoctorDashboard from '../src/pages/doctorDashbord/pages/DoctorDashbord.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>

      <DoctorDashboard />
    </BrowserRouter>
  );
}

export default App;
