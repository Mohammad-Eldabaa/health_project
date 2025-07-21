import React from "react";
import Register from "./pages/Auth/Register/Register.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import DoctorDashboard from "../src/pages/doctorDashbord/pages/DoctorDashbord.jsx";
import RoutesPages from "./routes/Routes.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <RoutesPages />
      {/* <DoctorDashboard /> */}
    </BrowserRouter>
  );
}
