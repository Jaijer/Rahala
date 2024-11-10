import React from 'react';
import Layout from './components/Layout';
import NotificationForm from './components/NotificationForm';

function NotificationsSettings() {
  return (
    <Layout activeTab="notifications">
      <div className="p-6"> {/* Consistent padding */}
        <h1 className="text-2xl font-semibold mb-6">التنبيهات</h1>
        <NotificationForm />
      </div>
    </Layout>
  );
}

export default NotificationsSettings;
