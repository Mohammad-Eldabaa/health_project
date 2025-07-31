import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesPages from "./routes/Routes.jsx";
import { initializeLocalData } from "./utils/initLocalData";
import { setupRealtimePatients } from "./lib/supabaseRealtime.js";
import useDoctorDashboardStore from "./store/doctorDashboardStore.js";







export default function App() {
  const fetchData = useDoctorDashboardStore((state) => state.fetchData);


  useEffect(() => {
    initializeLocalData();
  }, []);


  useEffect(() => {
    fetchData();

    const channel = setupRealtimePatients();
    return () => {
      channel.unsubscribe();
    };
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
// import NursingAddAnointment from './pages/Nursing/NursingAddAnointment';
// import NursingAppointmentList from './pages/Nursing/NursingAppointmentList';
// import NursingPatientsList from './pages/Nursing/NursingPatientsList';
// import { AppointmentProvider } from './pages/Nursing/AppointmentContext';

// function App() {
//   return (
//     <AppointmentProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<NursingDashboard />} />
//           <Route path="/add-appointment" element={<NursingAddAnointment />} />
//           <Route path="/appointments" element={<NursingAppointmentList />} />
//           <Route path="/patients" element={<NursingPatientsList />} />
//         </Routes>
//       </Router>
//     </AppointmentProvider>
//   );
// }

// export default App;
