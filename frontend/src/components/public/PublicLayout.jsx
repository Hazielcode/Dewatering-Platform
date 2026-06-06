import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin } from 'lucide-react';

const PublicLayout = ({ children }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* GLOBAL NAVBAR */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1.2rem 5%', backgroundColor: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.95)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px', background: 'var(--accent-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
          }}>
            <Droplets size={22} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Dewatering Solutions
          </span>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {[
            { path: '/', label: 'Inicio' },
            { path: '/nosotros', label: 'Nosotros' },
            { path: '/servicios', label: 'Servicios' },
            { path: '/productos', label: 'Equipos' },
            { path: '/capacitaciones', label: 'Capacitaciones' },
            { path: '/proyectos', label: 'Proyectos' },
            { path: '/descargas', label: 'Descargas' },
            { path: '/blog', label: 'Blog' },
            { path: '/contacto', label: 'Contacto' },
          ].map(link => (
            <Link key={link.path} to={link.path} style={{
              textDecoration: 'none', 
              color: isActive(link.path) ? 'var(--accent-primary)' : 'var(--text-secondary)', 
              fontWeight: isActive(link.path) ? 700 : 500, 
              fontSize: '0.88rem',
              transition: 'var(--transition)'
            }}>
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
            Acceso Clientes
          </Link>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* GLOBAL FOOTER */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '4rem 5% 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Droplets size={20} /></div>
              <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)' }}>Dewatering</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>Especialistas en separación sólido-líquido, procesos metalúrgicos y tratamiento de aguas para la industria.</p>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Enlaces Rápidos</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li><Link to="/nosotros" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Quiénes Somos</Link></li>
              <li><Link to="/servicios" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Servicios Especializados</Link></li>
              <li><Link to="/productos" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Catálogo de Equipos</Link></li>
              <li><Link to="/proyectos" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Casos de Éxito</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 700 }}>Contacto</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <MapPin size={16} color="var(--accent-primary)"/> Av. Industrial 123, Lima, Perú
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-primary)"/> +51 999 111 000
              </li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-primary)"/> ventas@dewateringsolutions.com.pe
              </li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          &copy; {new Date().getFullYear()} Dewatering Solutions. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
