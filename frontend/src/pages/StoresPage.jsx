import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Plus, Pencil, Trash2, MapPin, X, Store } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api.js';

const StoresPage = () => {
  const [stores, setStores] = useState([
    {
      id: 1,
      nombre: 'Sede Principal Lima Sur',
      ubicacion: 'Lurín Industrial Mza. A Lote 4, Lima, Perú',
      image_url: '/images/sucursal-lima.webp',
      fecha_creacion: '2023-01-15T00:00:00.000Z'
    },
    {
      id: 2,
      nombre: 'Centro de Operaciones Callao',
      ubicacion: 'Av. Elmer Faucett 2851, Callao, Perú',
      image_url: '/images/sucursal-callao.webp',
      fecha_creacion: '2024-05-20T00:00:00.000Z'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [form, setForm] = useState({ nombre: '', ubicacion: '', image_url: '' });
  const [error, setError] = useState('');

  const fetchStores = async () => {
    // Usando estado local para demostración
  };

  useEffect(() => { fetchStores(); }, []);

  const openCreate = () => { setEditingStore(null); setForm({ nombre: '', ubicacion: '', image_url: '' }); setError(''); setShowModal(true); };
  const openEdit = (s) => { setEditingStore(s); setForm({ nombre: s.nombre, ubicacion: s.ubicacion || '', image_url: s.image_url || '' }); setError(''); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editingStore) { 
        setStores(stores.map(s => s.id === editingStore.id ? { ...s, ...form } : s));
      } else { 
        setStores([...stores, { ...form, id: Date.now(), fecha_creacion: new Date().toISOString() }]);
      }
      setShowModal(false);
    } catch (err) { setError('Error al guardar'); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar sucursal?',
      text: 'Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try { 
      setStores(stores.filter(s => s.id !== id));
      Swal.fire({ title: 'Eliminado', text: 'La sucursal ha sido eliminada.', icon: 'success', timer: 1500, showConfirmButton: false });
    }
    catch (err) { Swal.fire({ title: 'Error', text: 'Error al eliminar', icon: 'error' }); }
  };

  return (
    <DashboardLayout title="Sucursales" subtitle="Gestión de tiendas y puntos de venta (ABAC Geográfico)">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.85rem', color:'var(--text-secondary)' }}>
          <Store size={16} color="var(--accent-primary)" />
          <span>{stores.length} sucursal{stores.length !== 1 ? 'es' : ''} registrada{stores.length !== 1 ? 's' : ''}</span>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18}/> Nueva Sucursal</button>
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {loading ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}><p className="text-secondary">Cargando sucursales...</p></div>
        ) : stores.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1/-1' }}><p className="text-secondary">No hay sucursales registradas.</p></div>
        ) : stores.map(s => (
          <div key={s.id} className="card" style={{ padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ width: '100%', height: '140px', backgroundColor: 'var(--bg-primary)', borderRadius: '12px', marginBottom: '1.25rem', overflow: 'hidden', position: 'relative' }}>
              {s.image_url ? (
                <img src={s.image_url} alt={s.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              ) : null}
              <div style={{ display: s.image_url ? 'none' : 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(139,92,246,0.08)' }}>
                <Store size={40} color="#8b5cf6" opacity={0.5} />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={20} color="#8b5cf6" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, fontWeight: 700 }}>{s.nombre}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>{s.ubicacion || 'Sin ubicación registrada'}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                <button className="btn-ghost" onClick={() => openEdit(s)} style={{ width: 30, height: 30 }}><Pencil size={14}/></button>
                <button className="btn-ghost" onClick={() => handleDelete(s.id)} style={{ width: 30, height: 30, color: 'var(--danger)' }}><Trash2 size={14}/></button>
              </div>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '100px', backgroundColor: 'rgba(37,99,235,0.08)', color: 'var(--accent-primary)' }}>ID: {s.id}</span>
              {s.fecha_creacion && (
                <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.5rem', borderRadius: '100px', backgroundColor: 'rgba(100,100,100,0.06)', color: 'var(--text-secondary)' }}>
                  Creada: {new Date(s.fecha_creacion).toLocaleDateString('es-PE')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>{editingStore ? 'Editar Sucursal' : 'Nueva Sucursal'}</h3>
              <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ width: 32, height: 32 }}><X size={18}/></button>
            </div>
            {error && <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group"><label className="input-label">Nombre</label><input className="input-control" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}/></div>
              <div className="input-group"><label className="input-label">Ubicación</label><input className="input-control" placeholder="Ej: Av. Javier Prado 1520, Lima" value={form.ubicacion} onChange={e => setForm({...form, ubicacion: e.target.value})}/></div>
              <div className="input-group"><label className="input-label">URL de Imagen</label><input className="input-control" placeholder="/images/sucursal.webp" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})}/></div>
              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>{editingStore ? 'Guardar Cambios' : 'Crear Sucursal'}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StoresPage;
