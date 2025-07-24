import { lazy } from "react";

export const Login = lazy(() => import("../pages/Auth/Login/Login.jsx"));
export const Register = lazy(() =>
  import("../pages/Auth/Register/Register.jsx")
);
export const BookingPage = lazy(() => import("../pages/bookingPage/index.jsx"));
export const FirstAid = lazy(() => import("../pages/FirstAid/FirstAid.jsx"));
export const FirstAidDetails = lazy(() =>
  import("../pages/FirstAid/FirstAidDetails.jsx")
);
export const DoctorDashboard = lazy(() =>
  import("../pages/doctorDashbord/pages/DoctorDashbord.jsx")
);
export const Home = lazy(() => import("../Components/Layout/Layout.jsx"));
export const MedicalArticles = lazy(() => import("../pages/MedicalArticles/MedicalArticles.jsx"));
