import { v4 } from "uuid";
import { BookingPage, Login, Register } from "./lazy";

export const RoutesArray = [
  {
    id: v4(),
    element: <Login />,
    path: "/",
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
];
