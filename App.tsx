
import React, { useState } from 'react';
import { UserRole } from './types';
import { Layout } from './components/Layout';
import { KYCWorkflow } from './components/KYCWorkflow';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  return (
    <Layout role={role} setRole={setRole}>
      {role === UserRole.USER ? (
        <KYCWorkflow />
      ) : (
        <AdminDashboard />
      )}
    </Layout>
  );
}
