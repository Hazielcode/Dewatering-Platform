import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Plus, Pencil, Trash2, Search, X, Star, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api.js';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', origin: '', short_description: '' });
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data.products || res.data || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { 
    setEditingProduct(null); 
    setForm({ name: '', category: '', origin: '', short_description: '' }); 
    setError(''); setShowModal(true); 
  };
  const openEdit = (p) => { 
    setEditingProduct(p); 
    setForm({ 
      name: p.name, category: p.category || '', origin: p.origin || '', short_description: p.short_description || ''
    }); 
    setError(''); setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const slug = form.name.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w-]+/g, '');
      const payload = { ...form, slug };
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      setShowModal(false);
      fetchProducts();
      Swal.fire({ title: 'Éxito', text: 'Producto guardado correctamente.', icon: 'success', timer: 1500, showConfirmButton: false, background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: '¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    });
    if (!result.isConfirmed) return;

    try { 
      await api.delete(`/products/${id}`); 
      fetchProducts(); 
      Swal.fire({ title: 'Eliminado', text: 'El producto ha sido eliminado.', icon: 'success', timer: 1500, showConfirmButton: false, background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    }
    catch (err) { 
      Swal.fire({ title: 'Error', text: err.response?.data?.error || 'Error al eliminar', icon: 'error', background: 'var(--bg-primary)', color: 'var(--text-primary)' });
    }
  };

  const filtered = products.filter(p => 
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.origin || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout title="Inventario" subtitle="Catálogo de equipos y productos industriales">
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', flex:1 }}>
          <div style={{ position: 'relative', flex: '1', maxWidth: '360px' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}/>
            <input className="input-control" placeholder="Buscar por nombre, categoría u origen..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.2rem' }}/>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', fontSize:'0.78rem' }}>
            <span style={{ display:'flex', alignItems:'center', gap:4, padding:'0.2rem 0.6rem', borderRadius:100, backgroundColor:'rgba(37,99,235,0.08)', color:'var(--accent-primary)', fontWeight:600 }}>
              <Package size={13}/> {products.length} productos
            </span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18}/> Nuevo Equipo</button>
      </div>

      {/* Tabla */}
      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                {['Equipo / Producto', 'Categoría', 'Origen', 'Estado', 'Acciones'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1.25rem', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando productos...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron productos. {!products.length && '(El backend puede estar apagado)'}</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-light)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '0.85rem 1.25rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      {p.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{p.category || '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.origin || '—'}</td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: p.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: p.is_active ? 'var(--success)' : 'var(--danger)' }}>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-ghost" onClick={() => openEdit(p)} style={{ width: 32, height: 32 }}><Pencil size={15}/></button>
                      <button className="btn-ghost" onClick={() => handleDelete(p.id)} style={{ width: 32, height: 32, color: 'var(--danger)' }}><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--text-primary)' }}>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ width: 32, height: 32 }}><X size={18}/></button>
            </div>
            {error && <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-group"><label className="input-label">Nombre del Equipo / Producto</label><input className="input-control" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div>
              <div className="grid-2">
                <div className="input-group"><label className="input-label">Categoría</label><input className="input-control" required value={form.category} onChange={e => setForm({...form, category: e.target.value})}/></div>
                <div className="input-group"><label className="input-label">Origen (Opcional)</label><input className="input-control" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})}/></div>
              </div>
              <div className="input-group"><label className="input-label">Descripción Corta</label><textarea className="input-control" rows="3" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})}></textarea></div>

              <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '1rem' }}>{editingProduct ? 'Guardar Cambios' : 'Crear Equipo'}</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default InventoryPage;
