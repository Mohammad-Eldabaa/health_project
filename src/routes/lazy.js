import { lazy } from "react";

export const Login = lazy(() => import("../pages/Auth/Login/Login.jsx"));
export const Register = lazy(() =>
  import("../pages/Auth/Register/Register.jsx")
);
export const BookingPage = lazy(() => import("../pages/bookingPage/index.jsx"));
