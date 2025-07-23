import React from "react";
import Register from "./pages/Auth/Register/Register.jsx";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RoutesPages from "./routes/Routes.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <RoutesPages />
    </BrowserRouter>
  );
}
 

// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import './App.css'
// import Layout from './Components/Layout/Layout'
// import Home from './Components/Home/Home'
// import About from './Components/About/About'
// import Contact from './Components/Contact/Contact'
// import Services from './Components/Services/Services'
// import Notfound from './Components/Notfound/Notfound'
// import Booking from './Components/Booking/Booking' 
// import Footer from './Components/Footer/Footer'

// const router = createBrowserRouter([
//   {
//     path: '', element: <Layout />, children: [
//       {
//         index: true, element: <Home />
//       },
//       {
//         path: 'about', element: <About />
//       },
//       {
//         path: 'contact', element: <Contact />
//       },
//       {
//         path: 'services', element: <Services />
//       },
//       {
//         path: 'booking', element: <Booking />
//       },
//       {
//         path: 'footer', element: <Footer />
//       },
//       {
//         path: '*', element: <Notfound />
//       }
//     ]
//   }
// ])

// function App() {
//   return (
//     <RouterProvider router={router} />
//   )