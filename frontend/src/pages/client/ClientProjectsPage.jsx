import React from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { Clock, CheckCircle, AlertCircle, FileText, Activity } from 'lucide-react';

const ClientProjectsPage = () => {
  // Datos basados en el portfolio real de Dewatering Solutions
  const activeProjects = [
    {
      id: 'PRJ-2026-041',
      title: 'Auditoría de Proceso de Filtración',
      location: 'Unidad Minera Antapaccay',
      status: 'En Ejecución',
      progress: 65,
      engineer: 'Alfonso Galvan',
      startDate: '10-May-2026',
      endDate: '25-Jun-2026',
      phases: [
        { name: 'Inspección en Terreno', status: 'completed', date: '15-May-2026' },
        { name: 'Toma de Muestras y Pruebas MCR', status: 'completed', date: '22-May-2026' },
        { name: 'Análisis de Reología', status: 'current', date: '05-Jun-2026' },
        { name: 'Entrega de Informe Final', status: 'pending', date: '25-Jun-2026' }
      ]
    },
    {
      id: 'PRJ-2026-058',
      title: 'Pruebas Metalúrgicas Batch (Sedimentación)',
      location: 'Laboratorio Dewatering (Indupark)',
      status: 'Fase Inicial',
      progress: 25,
      engineer: 'José Chunga',
      startDate: '01-Jun-2026',
      endDate: '15-Jul-2026',
      phases: [
        { name: 'Recepción de Muestras de Relaves', status: 'completed', date: '03-Jun-2026' },
        { name: 'Selección de Floculante y Dosificación', status: 'current', date: '08-Jun-2026' },
        { name: 'Pruebas de Sedimentación Dinámica', status: 'pending', date: '20-Jun-2026' },
        { name: 'Reporte Técnico', status: 'pending', date: '15-Jul-2026' }
      ]
    }
  ];

  const pastProjects = [
    {
      id: 'PRJ-2025-089',
      title: 'Overhaul de Filtro Prensa de Concentrado',
      location: 'Marcobre',
      endDate: '15-Dic-2025',
      type: 'Mantenimiento Mayor'
    },
    {
      id: 'PRJ-2025-042',
      title: 'Pilotaje Tratamiento de Aguas Ácidas',
      location: 'Shahuindo (Planta Piloto Móvil)',
      endDate: '08-Ago-2025',
      type: 'Servicio Piloto'
    }
  ];

  return (
    <DashboardLayout title="Mis Proyectos" subtitle="Seguimiento y control de servicios contratados">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Proyectos Activos */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <Activity size={20} color="var(--accent-primary)" /> Proyectos Activos
          </h2>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {activeProjects.map(project => (
              <div key={project.id} className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-primary)', backgroundColor: 'var(--accent-light)', padding: '0.25rem 0.6rem', borderRadius: '20px' }}>
                      {project.id}
                    </span>
                    <h3 style={{ fontSize: '1.1rem', marginTop: '0.75rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{project.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{project.location}</p>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--warning)', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
                    {project.status}
                  </span>
                </div>

                <div style={{ margin: '1.5rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Progreso General</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{project.progress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${project.progress}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '4px' }}></div>
                  </div>
                </div>

                {/* Línea de tiempo de Fases */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>Cronograma de Ejecución</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {project.phases.map((phase, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div>
                          {phase.status === 'completed' ? <CheckCircle size={18} color="var(--success)" /> : 
                           phase.status === 'current' ? <Clock size={18} color="var(--warning)" /> : 
                           <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border-color)', margin: '2px' }}></div>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', margin: 0, color: phase.status === 'pending' ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: phase.status === 'current' ? 600 : 400 }}>
                            {phase.name}
                          </p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{phase.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>Ingeniero a cargo</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Ing. {project.engineer}</p>
                  </div>
                  <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Contactar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Proyectos */}
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
            <CheckCircle size={20} color="var(--success)" /> Historial de Trabajos Realizados
          </h2>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>ID Proyecto</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Servicio</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ubicación</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Fecha Fin</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {pastProjects.map(proj => (
                  <tr key={proj.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{proj.id}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{proj.title}</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{proj.type}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{proj.location}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{proj.endDate}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                        <FileText size={16} /> Ver Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ClientProjectsPage;
