import React from 'react';
import Layout from './components/Layout';
import AccountForm from './components/AccountForm';

function AccountSettingsPage() {
  return (
    <Layout activeTab="account">
      <div className="p-6 md:p-8 lg:p-12"> {/* Responsive padding */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-12"> {/* Responsive text and increased margin */}
          إعدادات الحساب
        </h1>
        <AccountForm />
      </div>
    </Layout>
  );
}

export default AccountSettingsPage;
