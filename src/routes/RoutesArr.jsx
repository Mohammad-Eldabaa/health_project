import { v4 } from 'uuid';
import {
  Login,
  Register,
  BookingPage,
  FirstAid,
  FirstAidDetails,
  DoctorDashboard,
  Layout,
  Home,
  About,
  Contact,
  Services,
  Booking,
  Footer,
  Notfound,
  Forget,
  Reset,
  // PatientView,
  DoctorProfile,
  PatientProfile,
  NursingAppointments,
  NursingPatientsList,
} from './lazy';

export const RoutesArray = [
  { id: v4(), element: <Login />, path: '/login' },
  { id: v4(), element: <Register />, path: '/register' },
  { id: v4(), element: <Forget />, path: '/forgetpassword' },
  { id: v4(), element: <Reset />, path: '/resetpassword' },
  { id: v4(), element: <BookingPage />, path: '/bookingpage' },
  { id: v4(), element: <FirstAid />, path: '/firstaid' },
  { id: v4(), element: <FirstAidDetails />, path: '/firstaid/FirstAidDetails' },
  { id: v4(), element: <DoctorDashboard />, path: '/DoctorDashboard/*' },
  { id: v4(), element: <DoctorProfile />, path: '/profile' },
  { id: v4(), element: <PatientProfile />, path: '/patientProfile' },
  { id: v4(), element: <MedicalArticles />, path: '/MedicalArticles' },

  // Zezo Route
  { id: v4(), element: <Profile />, path: '/profile' },
  {
    id: v4(),
    element: <Layout />,
    path: '/nursing-dashboard',
    children: [
      { id: v4(), element: <NursingAppointments />, path: '', index: true },
      { id: v4(), element: <NursingPatientsList />, path: 'patients' },
    ],
  },
  // ZEZO
  {
    id: v4(),
    element: <Layout />,
    path: '/',
    children: [
      { id: v4(), element: <Home />, path: '', index: true },
      { id: v4(), element: <About />, path: 'about' },
      { id: v4(), element: <Contact />, path: 'contact' },
      { id: v4(), element: <Services />, path: 'services' },
      { id: v4(), element: <Booking />, path: 'booking' },
      { id: v4(), element: <Footer />, path: 'footer' },
    ],
  },
  { id: v4(), element: <Notfound />, path: '*' },
];
