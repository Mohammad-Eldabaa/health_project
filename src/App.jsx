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
