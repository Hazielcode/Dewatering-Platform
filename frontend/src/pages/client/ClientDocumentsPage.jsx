import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { FileText, Download, FileArchive, Search, Filter, ShieldCheck, Activity } from 'lucide-react';

const ClientDocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const documents = [
    {
      id: 'DOC-2026-101',
      title: 'Reporte de Reología y Sedimentación MCR',
      project: 'PRJ-2026-041 (Antapaccay)',
      type: 'Reporte Técnico',
      date: '05-Jun-2026',
      size: '4.2 MB',
      category: 'technical'
    },
    {
      id: 'DOC-2026-088',
      title: 'Certificado de Garantía - Placas Filtrantes',
      project: 'Suministro Lote 45',
      type: 'Certificado de Calidad',
      date: '28-May-2026',
      size: '1.1 MB',
      category: 'quality'
    },
    {
      id: 'DOC-2026-052',
      title: 'Manual de Operación de Centrífuga Pusher',
      project: 'PRJ-2026-045',
      type: 'Manual de Equipo',
      date: '15-May-2026',
      size: '15.8 MB',
      category: 'manual'
    },
    {
      id: 'DOC-2025-210',
      title: 'Dossier de Calidad - Overhaul Filtro Prensa',
      project: 'PRJ-2025-089 (Marcobre)',
      type: 'Dossier Final',
      date: '15-Dic-2025',
      size: '45.5 MB',
      category: 'dossier'
    }
  ];

  const getIconForCategory = (cat) => {
    switch(cat) {
      case 'technical': return <Activity size={20} color="var(--accent-primary)" />;
      case 'quality': return <ShieldCheck size={20} color="var(--success)" />;
      case 'manual': return <FileText size={20} color="var(--warning)" />;
      case 'dossier': return <FileArchive size={20} color="#8b5cf6" />;
      default: return <FileText size={20} color="var(--text-secondary)" />;
    }
  };

  const handleDownload = (id) => {
    alert('Conectando al repositorio seguro...\nDescargando archivo: ' + id + '.pdf');
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Mis Documentos" subtitle="Repositorio seguro de manuales, certificados y reportes técnicos">
      
      {/* Barra de Búsqueda y Filtros */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar documento por nombre, proyecto o ID..." 
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} 
          />
        </div>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <Filter size={18} /> Filtrar por Tipo
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Documento</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Proyecto / Referencia</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fecha</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tamaño</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Descarga</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? filteredDocuments.map(doc => (
              <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }} className="hover-row">
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {getIconForCategory(doc.category)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{doc.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{doc.type} | ID: {doc.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {doc.project}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {doc.date}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {doc.size}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button onClick={() => handleDownload(doc.id)} className="btn-outline" title="Descargar Documento Segurizado" style={{ padding: '0.5rem 1rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>
                    <Download size={16} /> Bajar PDF
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No se encontraron documentos que coincidan con la búsqueda "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .hover-row:hover {
          background-color: var(--bg-secondary);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ClientDocumentsPage;
