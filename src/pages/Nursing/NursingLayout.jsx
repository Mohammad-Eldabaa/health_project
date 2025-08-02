import React from 'react';
import { Outlet } from 'react-router-dom';

const NursingLayout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};

export default NursingLayout;