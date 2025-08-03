import React from 'react';
import { Outlet } from 'react-router-dom';

const NursingLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <Outlet />
    </div>
  );
};

export default NursingLayout;
