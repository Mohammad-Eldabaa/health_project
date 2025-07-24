import { v4 } from 'uuid';
import {
  Login,
  Register,
  BookingPage,
  FirstAid,
  FirstAidDetails,
  DoctorDashboard,
  Layout,
  DoctorProfile,
  Home,
  About,
  Contact,
  Services,
  Booking,
  Footer,
  Notfound,
  MedicalArticles,
  Profile,
  Forget,
  Reset,
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
  { id: v4(), element: <DoctorProfile />, path: '/DoctorProfile' },
  { id: v4(), element: <Profile />, path: '/profile' },

  // Zezo Route
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

  // Catch-all route for 404
  { id: v4(), element: <Notfound />, path: '*' },
];
