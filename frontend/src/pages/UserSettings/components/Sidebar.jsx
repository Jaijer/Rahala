import React from 'react';
import { Link } from 'react-router-dom';
import { User, Notification } from '@nextui-org/shared-icons';

function Sidebar({ activeTab }) {
  return (
    <div className="h-full p-6 lg:p-8 bg-gray-100"> {/* Increased padding */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 bg-teal-800 rounded-full flex items-center justify-center"> {/* Larger avatar */}
          <User className="w-10 h-10 text-white" />
        </div>
      </div>
      
      <div className="space-y-4"> {/* Increased spacing between links */}
        <Link 
          to="/user-settings"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-right rounded-lg text-lg
            ${activeTab === 'account' ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-right flex-1">إعدادات الحساب</span>
        </Link>
        
        <Link 
          to="/user-settings/notifications"
          className={`w-full flex items-center space-x-3 px-4 py-3 text-right rounded-lg text-lg
            ${activeTab === 'notifications' ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
        >
          <Notification className="w-6 h-6" />
          <span className="text-right flex-1">التنبيهات</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
