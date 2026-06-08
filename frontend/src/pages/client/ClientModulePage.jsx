import React from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';

const ClientModulePage = ({ title, icon: Icon }) => {
  return (
    <DashboardLayout title={title} subtitle="Módulo en construcción">
      <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '24px', border: '2px dashed var(--border-color)', marginTop: '2rem' }}>
        <div style={{ width: 80, height: 80, borderRadius: '20px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <Icon size={40} color="var(--accent-primary)" />
        </div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Módulo: {title}</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
          Estamos terminando de sincronizar este módulo con el sistema ERP de Dewatering Solutions. 
          Pronto podrá ver los detalles detallados aquí.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ClientModulePage;
