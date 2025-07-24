import { lazy } from 'react';

export const Login = lazy(() => import('../pages/Auth/Login/Login.jsx'));
export const Register = lazy(() => import('../pages/Auth/Register/Register.jsx'));
export const BookingPage = lazy(() => import('../pages/bookingPage/index.jsx'));
export const FirstAid = lazy(() => import('../pages/FirstAid/FirstAid.jsx'));
export const FirstAidDetails = lazy(() => import('../pages/FirstAid/FirstAidDetails.jsx'));
export const DoctorDashboard = lazy(() => import('../pages/doctorDashbord/pages/DoctorDashbord.jsx'));
export const DoctorProfile = lazy(() => import('../pages/DoctorProfile/Profile.jsx'));

export const Home = lazy(() => import('../Components/Home/Home'));
export const About = lazy(() => import('../Components/About/About'));
export const Contact = lazy(() => import('../Components/Contact/Contact'));
export const Services = lazy(() => import('../Components/Services/Services'));
export const Booking = lazy(() => import('../Components/Booking/Booking'));
export const Footer = lazy(() => import('../Components/Footer/Footer'));
export const Layout = lazy(() => import('../Components/Layout/Layout'));
export const Notfound = lazy(() => import('../Components/Notfound/Notfound'));

