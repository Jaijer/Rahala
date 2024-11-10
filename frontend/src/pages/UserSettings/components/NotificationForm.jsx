import React from 'react';
import { Switch } from '@nextui-org/react';

function NotificationForm() {
  function handleEmailNotificationChange(isSelected) {
    console.log('Email notifications:', isSelected);
  }

  function handleTripUpdateChange(isSelected) {
    console.log('Trip updates:', isSelected);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <span>تلقي إعلانات في البريد الإلكتروني</span>
        <Switch 
          defaultSelected 
          color="primary" 
          onValueChange={handleEmailNotificationChange}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span>تلقي تحديثات الرحلة على البريد الإلكتروني</span>
        <Switch 
          defaultSelected 
          color="primary"
          onValueChange={handleTripUpdateChange}
        />
      </div>
    </div>
  );
}

export default NotificationForm;
