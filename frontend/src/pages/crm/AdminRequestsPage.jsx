import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { Mail, Briefcase, Clock, Building, MessageSquare, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/leads');
      setRequests(res.data?.leads || res.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (email, name) => {
    const subject = encodeURIComponent('Cotización de Servicios - Dewatering Solutions');
    const body = encodeURIComponent(`Estimado ${name},\n\n`);
    const url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}&su=${subject}&body=${body}`;
    // Abrir en una ventana popup limpia centrada para que se vea profesional y no estirada
    const width = 800;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(url, 'Responder', `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar solicitud?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/leads/${id}`);
        fetchRequests();
        Swal.fire('Eliminado!', 'La solicitud ha sido eliminada.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar la solicitud.', 'error');
      }
    }
  };

  const handleViewMessage = (req) => {
    Swal.fire({
      title: 'Detalle del Requerimiento',
      html: `
        <div style="text-align: left; padding: 10px;">
          <p><strong>Empresa:</strong> ${req.company_name}</p>
          <p><strong>Interés:</strong> ${req.service_interest}</p>
          <p><strong>Mensaje:</strong><br/> ${req.message || 'Sin mensaje adicional.'}</p>
        </div>
      `,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#3b82f6'
    });
  };

  return (
    <DashboardLayout title="Bandeja de Solicitudes" subtitle="Requerimientos recibidos desde la página web">
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha / Origen</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Empresa / Contacto</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Servicio de Interés</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Cargando solicitudes...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay solicitudes web nuevas.</td></tr>
            ) : requests.map(req => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    <Clock size={14} color="var(--accent-primary)"/> {new Date(req.created_at).toLocaleDateString()}
                  </div>
                  <span className="badge" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.75rem' }}>Formulario Web</span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={16} /> {req.company_name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <Briefcase size={14} /> {req.contact_name} ({req.contact_email})
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {req.service_interest}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleViewMessage(req)} className="btn-ghost" title="Leer Mensaje" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <MessageSquare size={18} color="var(--accent-primary)" />
                    </button>
                    <button onClick={() => handleDelete(req.id)} className="btn-ghost" title="Eliminar" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <Trash2 size={18} color="var(--danger)" />
                    </button>
                    <button onClick={() => handleRespond(req.contact_email, req.contact_name)} className="btn" style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--accent-primary)', color: 'white', borderRadius: '8px', fontSize: '0.85rem' }}>
                      <Mail size={16} style={{ marginRight: '6px' }}/> Responder
                    </button>
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

export default AdminRequestsPage;
