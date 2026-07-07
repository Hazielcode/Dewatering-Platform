import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout.jsx';
import { Package, Plus, Edit2, Trash2, Tag, Search, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    category: '',
    short_description: '',
    origin: '',
    slug: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire('Error', 'No se pudo cargar el inventario.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (product = null) => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        category: product.category || '',
        short_description: product.short_description || '',
        origin: product.origin || '',
        slug: product.slug || ''
      });
    } else {
      setFormData({ id: null, name: '', category: '', short_description: '', origin: '', slug: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await api.put(`/products/${formData.id}`, formData);
        Swal.fire('Éxito', 'Producto actualizado correctamente.', 'success');
      } else {
        await api.post('/products', formData);
        Swal.fire('Éxito', 'Producto añadido al inventario.', 'success');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      Swal.fire('Error', 'No se pudo guardar el producto.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: "Esta acción lo borrará del catálogo público y del inventario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
        Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="topbar">
        <div className="topbar-left">
          <h1>Inventario de Equipos</h1>
          <p>Gestione el catálogo de maquinaria industrial y repuestos.</p>
        </div>
        <div className="topbar-right">
          <button onClick={() => openModal()} className="btn btn-primary">
            <Plus size={18} /> Agregar Producto
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Catálogo Actual</h3>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>Cargando inventario...</div>
            ) : products.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <Package size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
                <p>No hay productos en el inventario.</p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>FOTO / EQUIPO</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>CATEGORÍA</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>ORIGEN</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>DESCRIPCIÓN BREVE</th>
                    <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const imgName = product.slug === 'filtro-prensa-dewatering' ? 'filtro-prensa' 
                                  : product.slug === 'espesador-clarificador-roytec' ? 'espesador-roytec' 
                                  : product.slug === 'bomba-centrifuga-pemo' ? 'bomba-pemo' 
                                  : 'centrifuga';
                    return (
                      <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', flexShrink: 0 }}>
                              <img 
                                src={`/images/${imgName}.webp`} 
                                alt={product.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display='none'; }}
                              />
                            </div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{product.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
                            <Tag size={12} /> {product.category || 'General'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{product.origin || 'N/A'}</td>
                        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.short_description || 'Sin descripción'}
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => openModal(product)} className="btn-ghost" title="Editar" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                              <Edit2 size={18} color="var(--accent-primary)" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="btn-ghost" title="Eliminar" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                              <Trash2 size={18} color="var(--danger)" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Agregar/Editar Producto */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', margin: '2rem', animation: 'modalSlideIn 0.3s ease-out', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="card-header" style={{ padding: '1.5rem 2rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {formData.id ? 'Editar Equipo' : 'Nuevo Equipo al Inventario'}
              </h3>
            </div>
            <div className="card-body" style={{ padding: '2rem' }}>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Nombre del Equipo</label>
                  <input type="text" className="input-control" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Ej. Filtro Prensa de Alta Presión" />
                </div>
                
                <div className="grid-2">
                  <div className="input-group">
                    <label className="input-label">Categoría</label>
                    <select className="input-control" name="category" value={formData.category} onChange={handleInputChange} required>
                      <option value="">Seleccione...</option>
                      <option value="Separación Sólido-Líquido">Separación Sólido-Líquido</option>
                      <option value="Bombeo Industrial">Bombeo Industrial</option>
                      <option value="Clasificación">Clasificación</option>
                      <option value="Repuestos">Repuestos</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Origen (Fabricación)</label>
                    <input type="text" className="input-control" name="origin" value={formData.origin} onChange={handleInputChange} placeholder="Ej. Italia, Sudáfrica, Perú" />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Identificador URL (Slug)</label>
                  <input type="text" className="input-control" name="slug" value={formData.slug} onChange={handleInputChange} required placeholder="ej. filtro-prensa-dewatering" />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sin espacios, use guiones (ej. bomba-pemo)</span>
                </div>

                <div className="input-group">
                  <label className="input-label">Descripción Breve</label>
                  <textarea className="input-control" name="short_description" value={formData.short_description} onChange={handleInputChange} rows="3" required placeholder="Describe la capacidad y utilidad del equipo..."></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button type="button" onClick={closeModal} className="btn btn-ghost" style={{ padding: '0.75rem 1.5rem' }}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>{formData.id ? 'Guardar Cambios' : 'Agregar Equipo'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminProductsPage;
