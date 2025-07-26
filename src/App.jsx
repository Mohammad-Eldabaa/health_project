import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesPages from "./routes/Routes.jsx";
import { initializeLocalData } from "./utils/initLocalData";

export default function App() {
  useEffect(() => {
    initializeLocalData();
  }, []);

  return (
    <BrowserRouter>
      <RoutesPages />
    </BrowserRouter>
  );
}
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css';
// import NursingDashboard from './pages/Nursing/NursingDashboard';
// import NursingAppointmentList from './pages/Nursing/NursingAppointmentList';
// import NursingPatientsList from './pages/Nursing/NursingPatientsList';
// import { AppointmentProvider } from './pages/Nursing/AppointmentContext';
// import NursingAddAppointment from './pages/Nursing/NursingAddAppointment';

// function App() {
//   return (
//     <AppointmentProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<NursingDashboard />} />
//           <Route path="/add-appointment" element={<NursingAddAppointment />} />
//           <Route path="/appointments" element={<NursingAppointmentList />} />
//           <Route path="/patients" element={<NursingPatientsList />} />
//         </Routes>
//       </Router>
//     </AppointmentProvider>
//   );
// }

// export default App;
