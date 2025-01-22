import React from 'react';
import Sidebar from './Sidebar';

function Layout({ children, activeTab }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Main content with responsive width */}
      <div className="flex-1 lg:w-[calc(100%-16rem)]" dir="rtl">
        <div className="w-full lg:w-[80%] xl:w-[70%] mx-auto">
          {children}
        </div>
      </div>
      
      {/* Sidebar - responsive positioning */}
      <div className="w-full lg:w-64 bg-gray-100 order-first lg:order-last">
        <Sidebar activeTab={activeTab} />
      </div>
    </div>
  );
}

export default Layout;
