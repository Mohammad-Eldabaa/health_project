import { v4 } from "uuid";
import { BookingPage, Login, Register, FirstAid, FirstAidDetails } from "./lazy";

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
    element: <FirstAid />,
    path: "/",
  },
  {
    id: v4(),
    element: <FirstAidDetails />,
    path: "/firstaiddetails",
  },
];
