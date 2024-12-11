import React, { useState, useEffect } from 'react';
import { Switch } from '@nextui-org/react';
import useUserStore from '../../../stores/userDataStore';
import api from '../../../api/axios';

function NotificationForm() {
  const { userData } = useUserStore();
  const userId = userData?._id; // Access user ID from store

  const [advNotifications, setadvNotifications] = useState(false);
  const [tripNotifications, settripNotifications] = useState(false);

  useEffect(() => {
    if (!userId) return;
  
    const fetchNotificationSettings = async () => {
      try {
        const response = await api.get(`/api/users/${userId}`);
        const settings = response.data;
        console.log("Fetched Settings:", settings);
        setadvNotifications(settings.advNotifications);
        settripNotifications(settings.tripNotifications);
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };
  
    fetchNotificationSettings();
  }, [userId]);

  function handleAdvNotificationChange(e) {
    const newValue = e.target.checked;
    setadvNotifications(newValue);
    updateNotificationSettings(newValue, tripNotifications);
  }

  function handleTripUpdateChange(e) {
    const newValue = e.target.checked;
    settripNotifications(newValue);
    updateNotificationSettings(advNotifications, newValue);
  }

  const updateNotificationSettings = async (advNotificationsValue, tripNotificationsValue) => {
    try {
      console.log("Sending data:", { advNotifications: advNotificationsValue, tripNotifications: tripNotificationsValue });
      await api.put(`/api/users/user-settings/notifications/${userId}`, {
        advNotifications: advNotificationsValue,
        tripNotifications: tripNotificationsValue
      });
      console.log("Notification settings updated successfully");
    } catch (error) {
      console.error("Error updating notification settings:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <span>تلقي إعلانات في البريد الإلكتروني</span>
        <Switch 
          isSelected ={advNotifications}
          color="primary"
          onChange={handleAdvNotificationChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <span>تلقي تحديثات الرحلة على البريد الإلكتروني</span>
        <Switch 
          isSelected = {tripNotifications}
          color="primary"
          onChange={handleTripUpdateChange}
        />
      </div>
    </div>
  );
}

export default NotificationForm;

