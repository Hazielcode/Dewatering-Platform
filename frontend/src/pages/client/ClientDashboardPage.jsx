import React from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { Store, FileText, Package, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data for client dashboard
  const stats = [
    { label: 'Proyectos Activos', value: '2', icon: Store, color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
    { label: 'Cotizaciones Pendientes', value: '1', icon: FileText, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { label: 'Documentos Recientes', value: '4', icon: Package, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  ];

  const recentProjects = [
    { id: 'PRJ-2026-001', name: 'Ensayo de Filtración al Vacío', status: 'En Proceso', progress: 65, date: '10 Jun 2026' },
    { id: 'PRJ-2026-002', name: 'Evaluación de Floculantes', status: 'Completado', progress: 100, date: '05 Jun 2026' }
  ];

  const recentQuotations = [
    { id: 'COT-2026-105', title: 'Pilotaje Espesamiento', amount: '$4,500.00', status: 'Pendiente' },
    { id: 'COT-2026-088', title: 'Montaje Filtro Prensa FPA-1500', amount: '$12,000.00', status: 'Aprobada' }
  ];

  return (
    <DashboardLayout title="Mi Oficina Virtual" subtitle={`Bienvenido al portal de seguimiento de Dewatering Solutions, ${user?.company || 'Cliente'}`}>
      {/* KPI Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card stat-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, cursor: 'default', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: '20px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bg, width: 50, height: 50, borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={26} color={stat.color} />
            </div>
            <div className="stat-info" style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              <h3 style={{ margin: '0.25rem 0 0', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Mis Proyectos Recientes */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.3s', backgroundColor: 'var(--bg-primary)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <Store size={18} color="var(--accent-primary)"/> Proyectos Activos
            </h3>
            <button className="btn-ghost" onClick={() => navigate('/client/projects')} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>Ver todos</button>
          </div>
          <div className="card-body" style={{ padding: '1rem 1.5rem 1.5rem' }}>
            {recentProjects.map((p, idx) => (
              <div key={idx} style={{ padding: '1rem 0', borderBottom: idx !== recentProjects.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{p.name}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.5rem', borderRadius: '6px' }}>{p.id}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.progress}%`, backgroundColor: p.progress === 100 ? 'var(--success)' : 'var(--accent-primary)', borderRadius: '10px' }}></div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: p.progress === 100 ? 'var(--success)' : 'var(--accent-primary)' }}>{p.progress}%</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Última actualización: {p.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mis Cotizaciones Recientes */}
        <div className="card animate-fade-in" style={{ animationDelay: '0.4s', backgroundColor: 'var(--bg-primary)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <FileText size={18} color="#f59e0b"/> Cotizaciones Recientes
            </h3>
            <button className="btn-ghost" onClick={() => navigate('/client/quotations')} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>Ver todas</button>
          </div>
          <div className="card-body" style={{ padding: '1.5rem' }}>
            {recentQuotations.map((q, idx) => (
              <div key={idx} style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)', marginBottom: idx !== recentQuotations.length - 1 ? '1rem' : 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{q.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{q.id}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{q.amount}</div>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '0.25rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                    backgroundColor: q.status === 'Aprobada' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                    color: q.status === 'Aprobada' ? '#10b981' : '#f59e0b'
                  }}>
                    {q.status === 'Aprobada' ? <CheckCircle size={12} strokeWidth={3}/> : <Clock size={12} strokeWidth={3}/>}
                    {q.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
