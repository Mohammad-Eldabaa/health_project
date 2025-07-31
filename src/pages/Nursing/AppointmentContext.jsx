import React, { createContext, useState, useEffect } from "react";

// Create the context
export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  // Initialize state with data from localStorage or empty array
  const [appointments, setAppointments] = useState(() => {
    const savedAppointments = localStorage.getItem("appointments");
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment) => {
    setAppointments((prev) => {
      const newAppointments = [...prev, { ...appointment, id: Date.now() }];
      return newAppointments;
    });
  };

  const cancelAppointment = (id) => {
    setAppointments((prev) => {
      const newAppointments = prev.filter((appt) => appt.id !== id);
      return newAppointments;
    });
  };

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, cancelAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};