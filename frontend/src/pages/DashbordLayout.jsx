import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div
     
    >
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
