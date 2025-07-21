import { v4 } from "uuid";
import { BookingPage, DoctorProfile, Login, Register } from "./lazy";

export const RoutesArray = [
  {
    id: v4(),
    element: <Login />,
    path: "/Login",
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
];
