import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const ClientQuotationsPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await api.get('/quotations');
      setQuotations(response.data.quotations || response.data);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/quotations/${id}/status`, { status: 'APPROVED' });
      fetchQuotations();
      Swal.fire({
        title: 'Aprobada',
        text: `Cotización aprobada exitosamente. El equipo ha sido notificado.`,
        icon: 'success',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo aprobar la cotización.', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/quotations/${id}/status`, { status: 'REJECTED' });
      fetchQuotations();
      Swal.fire({
        title: 'Rechazada',
        text: `Cotización rechazada. Nos pondremos en contacto para reevaluar la propuesta.`,
        icon: 'error',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        confirmButtonColor: '#ef4444'
      });
    } catch (error) {
      Swal.fire('Error', 'No se pudo rechazar la cotización.', 'error');
    }
  };

  const handleDownload = (id, number) => {
    Swal.fire({
      title: 'Generando PDF Oficial...',
      text: `Por favor espere un momento.`,
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    api.get(`/quotations/${id}/pdf`, { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Cotizacion_${number}.pdf`);
        document.body.appendChild(link);
        link.click();
        Swal.close();
      })
      .catch(() => {
        Swal.fire('Error', 'No se pudo generar el documento.', 'error');
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
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{q.quotation_number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Emitida: {new Date(q.created_at).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Válida hasta: {new Date(q.valid_until).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  $ {Number(q.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  {q.status === 'PENDING' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--warning)', backgroundColor: 'rgba(245,158,11,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><Clock size={14}/> Pendiente</span>}
                  {q.status === 'APPROVED' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)', backgroundColor: 'rgba(16,185,129,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><CheckCircle size={14}/> Aprobada</span>}
                  {q.status === 'REJECTED' && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--danger)', backgroundColor: 'rgba(239,68,68,0.1)', padding: '0.35rem 0.75rem', borderRadius: '20px' }}><XCircle size={14}/> Rechazada</span>}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleDownload(q.id, q.quotation_number)} className="btn-ghost" title="Descargar PDF" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <Download size={18} color="var(--text-secondary)" />
                    </button>
                    {q.status === 'PENDING' && (
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
