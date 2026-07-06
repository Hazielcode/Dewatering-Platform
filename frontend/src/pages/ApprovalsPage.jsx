import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { CheckCircle, XCircle, Clock, Building, Mail, Phone, Shield } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api.js';

const ApprovalsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (err) {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id, name) => {
    const result = await Swal.fire({
      title: '¿Aprobar acceso corporativo?',
      text: `¿Estás seguro de aprobar a ${name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    });
    if (!result.isConfirmed) return;

    try {
      await api.patch(`/users/${id}/toggle`, { is_active: true });
      fetchUsers();
      Swal.fire({ title: 'Aprobado!', text: 'El usuario ya tiene acceso al sistema.', icon: 'success', timer: 2000, showConfirmButton: false, background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.error || 'Error al aprobar usuario.', icon: 'error', background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    }
  };

  const handleReject = async (id, name) => {
    const result = await Swal.fire({
      title: '¿Rechazar solicitud?',
      text: `¿Estás seguro de rechazar y eliminar la solicitud de ${name}? Esta acción es irreversible.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, rechazar y eliminar',
      cancelButtonText: 'Cancelar',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
      Swal.fire({ title: 'Eliminado', text: 'La solicitud ha sido rechazada y eliminada.', icon: 'success', timer: 2000, showConfirmButton: false, background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.error || 'Error al eliminar usuario.', icon: 'error', background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    }
  };

  const pendingUsers = users.filter(u => !u.is_active);
  const activeUsers = users.filter(u => u.is_active);

  return (
    <DashboardLayout title="Aprobación de Clientes" subtitle="Gestión de solicitudes de acceso corporativo B2B">
      
      {/* SECCIÓN PENDIENTES */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="var(--accent-primary)" /> Solicitudes Pendientes ({pendingUsers.length})
        </h3>
        
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}><p className="text-secondary">Cargando...</p></div>
        ) : pendingUsers.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'rgba(16,185,129,0.05)', border: '1px dashed rgba(16,185,129,0.3)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--success)' }}>
              <CheckCircle size={24} />
            </div>
            <p className="text-secondary">No hay solicitudes pendientes. Estás al día.</p>
          </div>
        ) : (
          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
            {pendingUsers.map(user => (
              <div key={user.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', borderTop: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{user.full_name || 'Sin Nombre'}</h4>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '100px', backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 600 }}>En Revisión</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Building size={16} /> <strong>Empresa:</strong> {user.company || 'No especificada'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Shield size={16} /> <strong>Cargo:</strong> {user.position || 'No especificado'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Mail size={16} /> {user.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Phone size={16} /> {user.phone || 'No registrado'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => handleApprove(user.id, user.full_name)} className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#10b981', border: 'none' }}>
                    <CheckCircle size={16} /> Aprobar
                  </button>
                  <button onClick={() => handleReject(user.id, user.full_name)} className="btn-ghost" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <XCircle size={16} /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </DashboardLayout>
  );
};

export default ApprovalsPage;
