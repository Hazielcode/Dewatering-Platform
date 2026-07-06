import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const ClientQuotationsPage = () => {
  const [quotations, setQuotations] = useState([
    {
      id: 'COT-2026-089',
      title: 'Suministro de Filtro Prensa automatizado y Placas',
      date: '02-Jun-2026',
      amount: '$145,000.00',
      status: 'pending',
      validUntil: '02-Jul-2026'
    },
    {
      id: 'COT-2026-045',
      title: 'Overhaul de Centrífuga Pusher',
      date: '15-May-2026',
      amount: '$32,500.00',
      status: 'approved',
      validUntil: '15-Jun-2026'
    },
    {
      id: 'COT-2026-012',
      title: 'Estudio de Reología y Filtración Piloto',
      date: '10-Ene-2026',
      amount: '$8,200.00',
      status: 'approved',
      validUntil: '10-Feb-2026'
    }
  ]);

  const handleApprove = (id) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'approved' } : q));
    Swal.fire({
      title: 'Aprobada',
      text: `Cotización ${id} aprobada exitosamente. El equipo ha sido notificado.`,
      icon: 'success',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#10b981'
    });
  };

  const handleReject = (id) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'rejected' } : q));
    Swal.fire({
      title: 'Rechazada',
      text: `Cotización ${id} rechazada. Nos pondremos en contacto para reevaluar la propuesta.`,
      icon: 'error',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      confirmButtonColor: '#ef4444'
    });
  };

  const handleDownload = (id) => {
    Swal.fire({
      title: 'Descargando',
      text: `Descargando archivo encriptado: ${id}_Propuesta_Tecnica.pdf`,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    });
  };

  return (
    <DashboardLayout title="Mis Cotizaciones" subtitle="Gestión de propuestas técnico-económicas">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>ID / Fecha</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detalle de Propuesta</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monto (USD)</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estado</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{q.id}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Emitida: {q.date}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Válida hasta: {q.validUntil}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {q.amount}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  {q.status === 'pending' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--warning)', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><Clock size={14}/> Pendiente</span>}
                  {q.status === 'approved' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><CheckCircle size={14}/> Aprobada</span>}
                  {q.status === 'rejected' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><XCircle size={14}/> Rechazada</span>}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleDownload(q.id)} className="btn-ghost" title="Descargar PDF" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <Download size={18} color="var(--text-secondary)" />
                    </button>
                    {q.status === 'pending' && (
                      <>
                        <button onClick={() => handleApprove(q.id)} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--success)', color: 'white', borderRadius: '8px', fontSize: '0.85rem' }}>Aprobar</button>
                        <button onClick={() => handleReject(q.id)} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '8px', fontSize: '0.85rem' }}>Rechazar</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ClientQuotationsPage;
