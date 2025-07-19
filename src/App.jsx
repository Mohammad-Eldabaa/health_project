import React from 'react'
import Register from './pages/Auth/Register/Register.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Auth/Login/Login'
export default function App() {
  let routes = createBrowserRouter([
    { index: true, element: <Login /> },
    { path: '/register', element: <Register /> },])

  return (
    <RouterProvider router={routes}></RouterProvider>
  )
}
