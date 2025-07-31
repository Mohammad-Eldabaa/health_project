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
// import NursingPatientsList from './pages/Nursing/NursingPatientsList';
// import NursingAppointments from './pages/Nursing/NursingAppointments';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<NursingAppointments />} />
//         <Route path="/patients" element={<NursingPatientsList />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
