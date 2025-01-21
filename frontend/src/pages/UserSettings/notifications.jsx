import React from 'react';
import Layout from './components/Layout';
import NotificationForm from './components/NotificationForm';

function NotificationsSettings() {
  return (
    <Layout activeTab="notifications">
      <div className="p-6 md:p-8 lg:p-12"> {/* Consistent padding */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12">التنبيهات</h1>
        <NotificationForm />
      </div>
    </Layout>
  );
}

export default NotificationsSettings;
