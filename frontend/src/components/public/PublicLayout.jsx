import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin } from 'lucide-react';
import DewateringChatbot from '../DewateringChatbot.jsx';

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', margin: '-10px 0' }}>
          <img className="logo-dynamic" src="/logodewatering.png" alt="Dewatering Solutions" style={{ height: '110px', width: 'auto', objectFit: 'contain', transform: 'scale(1.2)' }} />
        </Link>
        <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
          {[
            { path: '/', label: 'Inicio' },
            { path: '/nosotros', label: 'Nosotros' },
            { path: '/servicios', label: 'Servicios' },
            { path: '/productos', label: 'Equipos' },
            { path: '/capacitaciones', label: 'Capacitaciones' },
            { path: '/proyectos', label: 'Proyectos' },
            { path: '/descargas', label: 'Descargas' },
            { path: '/blog', label: 'Blog' }
          ].map(link => (
            <Link key={link.path} to={link.path} style={{
              textDecoration: 'none', 
              color: isActive(link.path) ? 'var(--accent-primary)' : 'var(--text-secondary)', 
              fontWeight: isActive(link.path) ? 700 : 500, 
              fontSize: '1rem',
              transition: 'var(--transition)'
            }}>
              {link.label}
            </Link>
          ))}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.75rem' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', fontSize: '0.95rem' }}>
              Acceso Clientes
            </Link>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* GLOBAL FOOTER (MINING CORPORATE STYLE) */}
      <footer style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '5rem 5% 2rem', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Logo Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: '1 / -1', '@media (minWidth: 1024px)': { gridColumn: 'span 2' } }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '-10px 0' }}>
              <img className="logo-dark-bg" src="/logodewatering.png" alt="Dewatering Solutions" style={{ height: '130px', width: 'auto', objectFit: 'contain', transform: 'scale(1.2)', transformOrigin: 'left center' }} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: '300px' }}>
              Especialistas en separación sólido-líquido, procesos metalúrgicos y tratamiento de aguas para la gran industria minera.
            </p>
          </div>

          {/* Col 1: Nosotros */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: 600 }}>Nosotros</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/nosotros" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Historia</Link></li>
              <li><Link to="/nosotros" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Misión y Visión</Link></li>
              <li><Link to="/nosotros" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Valores Corporativos</Link></li>
            </ul>
          </div>

          {/* Col 2: Servicios */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: 600 }}>Servicios</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/servicios" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Ensayos de Laboratorio</Link></li>
              <li><Link to="/servicios" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Soporte Metalúrgico</Link></li>
              <li><Link to="/servicios" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Montaje Industrial</Link></li>
              <li><Link to="/servicios" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Tratamiento de Aguas</Link></li>
            </ul>
          </div>

          {/* Col 3: Productos */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: 600 }}>Equipos</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/productos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Filtros Prensa</Link></li>
              <li><Link to="/productos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Espesadores</Link></li>
              <li><Link to="/productos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Decanters</Link></li>
              <li><Link to="/productos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Bombas Industriales</Link></li>
            </ul>
          </div>

          {/* Col 4: Experiencia */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: 600 }}>Experiencia</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><Link to="/proyectos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Proyectos Ejecutados</Link></li>
              <li><Link to="/proyectos" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Casos de Éxito</Link></li>
              <li><Link to="/capacitaciones" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}>Capacitaciones</Link></li>
              <li><span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Certificaciones ISO 9001</span></li>
            </ul>
          </div>

          {/* Col 5: Contáctenos */}
          <div style={{ gridColumn: '1 / -1', '@media (minWidth: 1024px)': { gridColumn: 'span 2' } }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#ffffff', fontWeight: 600 }}>Contáctenos</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }}/> 
                <div style={{ wordBreak: 'break-word' }}>
                  Av. Circunvalación, Lurigancho-Chosica 15457, Perú
                  <br /><br />
                  Av. Circunvalación Club Golf Los Incas Nro. 208 Int. 602, Santiago de Surco
                  <br /><br />
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Futuro local:</span> Indupark Chilca (2500 m2)
                </div>
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Phone size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }}/> 
                <div>
                  <div style={{ marginBottom: '4px' }}>Atención (WhatsApp / Llamada):</div>
                  <div style={{ color: '#ffffff', fontWeight: 500 }}>+51 956 710 062</div>
                </div>
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Mail size={16} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }}/> 
                <div style={{ wordBreak: 'break-all' }}>
                  jose.chunga@dewatering.pe<br/>
                  alfonso.galvan@dewatering.pe
                </div>
              </li>
              <li style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1rem', display: 'inline-flex' }}>⌚</span> Horario: 8:30 a 18:00
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          paddingTop: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          maxWidth: '1300px',
          margin: '0 auto'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} Dewatering Solutions. Todos los derechos reservados.
          </div>
          
          {/* Redes Sociales */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              { id: 'linkedin', url: 'https://www.linkedin.com/company/dewatering-solutions-peru/?originalSubdomain=pe' },
              { id: 'youtube', url: '#' },
              { id: 'facebook', url: '#' }
            ].map(social => (
              <a key={social.id} href={social.url} target={social.url !== '#' ? "_blank" : "_self"} rel="noopener noreferrer" style={{ 
                width: 38, height: 38, borderRadius: '50%', 
                backgroundColor: 'var(--accent-primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', textDecoration: 'none', transition: 'transform 0.2s, background-color 0.2s',
                boxShadow: '0 4px 10px rgba(37,99,235,0.3)'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.backgroundColor = 'var(--accent-hover)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.backgroundColor = 'var(--accent-primary)'; }}
              >
                {social.id === 'linkedin' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>}
                {social.id === 'youtube' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>}
                {social.id === 'facebook' && <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* CHATBOT VIRTUAL PARA VISITANTES */}
      <DewateringChatbot />
    </div>
  );
};

export default PublicLayout;
