import React from 'react';
import { Outlet } from 'react-router-dom';

const NursingLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default NursingLayout;