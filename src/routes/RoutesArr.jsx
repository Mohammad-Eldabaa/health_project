import { v4 } from "uuid";
import { BookingPage, Login, Register, FirstAid, FirstAidDetails, DoctorProfile } from "./lazy";

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
    element: <BookingPage />,
    path: "/bookingPage",
  },
  {
    id: v4(),
    element: <DoctorProfile />,
    path: "/",
  },
  {
    id: v4(),
    element: <FirstAid />,
    path: "/firstaid",
  },
  {
    id: v4(),
    element: <FirstAidDetails />,
    path: "/firstaiddetails",
  },
];
