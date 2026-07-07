import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { FileText, Plus, CheckCircle, XCircle, Clock, Download, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const AdminQuotationsPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [quoteTitle, setQuoteTitle] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [isQuoting, setIsQuoting] = useState(false);

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

  const handleSendQuote = async () => {
    if (!quoteTitle || !quoteAmount) return Swal.fire('Error', 'Ingrese título y monto', 'error');
    setIsQuoting(true);
    try {
      await api.post('/quotations', {
        title: quoteTitle,
        description: quoteDesc,
        items: [{ description: quoteTitle, quantity: 1, unit_price: parseFloat(quoteAmount), subtotal: parseFloat(quoteAmount) }],
        subtotal: parseFloat(quoteAmount),
        tax: 0,
        total: parseFloat(quoteAmount),
        currency: 'USD',
      });
      Swal.fire('¡Éxito!', 'Cotización enviada. El cliente la verá en su portal.', 'success');
      setShowForm(false);
      setQuoteTitle('');
      setQuoteAmount('');
      setQuoteDesc('');
      fetchQuotations();
    } catch (error) {
      Swal.fire('Error', 'No se pudo generar la cotización', 'error');
    } finally {
      setIsQuoting(false);
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
    <DashboardLayout title="Gestión de Cotizaciones" subtitle="Administración y envío de propuestas a clientes">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-control" 
              placeholder="Buscar cotización..." 
              style={{ paddingLeft: '2.5rem', margin: 0 }}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> Nueva Cotización
        </button>
      </div>

      {showForm && (
        <div className="animate-fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', backgroundColor: 'var(--bg-primary)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.25rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18}/>
            </div>
            Generar Nueva Cotización Oficial
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Título de la Propuesta</label>
              <input type="text" className="input-control" value={quoteTitle} onChange={e => setQuoteTitle(e.target.value)} placeholder="Ej. Suministro de Bomba PEMO" style={{ width: '100%' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Monto Total (USD)</label>
              <input type="number" className="input-control" value={quoteAmount} onChange={e => setQuoteAmount(e.target.value)} placeholder="Ej. 15000" style={{ width: '100%' }} />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Descripción / Especificaciones Técnicas</label>
            <textarea className="input-control" rows="4" value={quoteDesc} onChange={e => setQuoteDesc(e.target.value)} placeholder="Detalles extra del equipo o servicio (Esto aparecerá en el PDF)..." style={{ width: '100%', resize: 'vertical' }}></textarea>
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSendQuote} disabled={isQuoting}>
              {isQuoting ? 'Generando PDF y Guardando...' : 'Confirmar y Enviar'}
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>N° Cotización</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Detalle</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monto (USD)</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Estado</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Cargando cotizaciones...</td></tr>
            ) : quotations.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay cotizaciones registradas. Crea una nueva.</td></tr>
            ) : quotations.map(q => (
              <tr key={q.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{q.quotation_number}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Emisión: {new Date(q.created_at).toLocaleDateString()}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{q.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vence: {new Date(q.valid_until).toLocaleDateString()}</div>
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
                  <button onClick={() => handleDownload(q.id, q.quotation_number)} className="btn-ghost" title="Descargar PDF Oficial" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                    <Download size={18} color="var(--accent-primary)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminQuotationsPage;
