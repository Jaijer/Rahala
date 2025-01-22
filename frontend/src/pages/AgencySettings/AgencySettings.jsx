import React from 'react';
import Layout from './components/Layout';
import AgencyAccountForm from './components/AgencyAccountForm';

function AgencySettingsPage() {
  return (
    <Layout activeTab="account">
      <div className="p-6 md:p-8 lg:p-12">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12">
          إعدادات الحساب
        </h1>
        <AgencyAccountForm />
      </div>
    </Layout>
  );
}

export default AgencySettingsPage;
