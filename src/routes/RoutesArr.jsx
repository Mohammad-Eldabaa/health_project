import { v4 } from "uuid";
import {
  BookingPage,
  Login,
  Register,
  FirstAid,
  FirstAidDetails,
  Home,
} from "./lazy";

export const RoutesArray = [
  {
    id: v4(),
    element: <Login />,
    path: "/login",
  },
  {
    id: v4(),
    element: <Register />,
    path: "/register",
  },
  {
    id: v4(),
    element: <Home />,
    path: "/home",
  },
  {
    id: v4(),
    element: <BookingPage />,
    path: "/bookingpage",
  },
  {
    id: v4(),
    element: <FirstAid />,
    path: "/",
  },
  {
    id: v4(),
    element: <FirstAidDetails />,
    path: "/FirstAidDetails",
  },
  // {
  //   id: v4(),
  //   element: <DoctorDashboard />,
  //   path: "/DoctorDashboard/*",
  // },
];
