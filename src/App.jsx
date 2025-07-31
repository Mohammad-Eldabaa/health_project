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