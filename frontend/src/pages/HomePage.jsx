import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Activity, ShieldCheck, Mail, Send, CheckCircle2, 
  Factory, Filter, Layers, Waves, Droplets, Target, Users, Settings, Award 
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    contact_name: '', contact_email: '', company_name: '', service_interest: '', message: ''
  });
  const [formStatus, setFormStatus] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/services`),
          axios.get(`${API_URL}/products`)
        ]);
        setServices(servicesRes.data.services.slice(0, 6)); // Top 6
        setProducts(productsRes.data.products.slice(0, 4)); // Top 4
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ status: 'loading', message: 'Enviando solicitud...' });
    try {
      await axios.post(`${API_URL}/leads/public`, formData);
      setFormStatus({ status: 'success', message: '¡Gracias! Nos pondremos en contacto pronto.' });
      setFormData({ contact_name: '', contact_email: '', company_name: '', service_interest: '', message: '' });
    } catch (error) {
      setFormStatus({ status: 'error', message: 'Hubo un error al enviar tu solicitud. Intenta nuevamente.' });
    }
  };

  return (
    <div className="home-page">
      {/* 1. SECTION: HERO (BANNER PRINCIPAL CON PARALLAX) */}
      <section className="parallax-bg" style={{
        padding: '8rem 5%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', minHeight: '85vh', justifyContent: 'center'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }} className="animate-fade-in">
          <div className="glass-panel" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '0.5rem 1.25rem', borderRadius: '99px', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' }}>
            <Award size={18} color="#3b82f6" /> Certificados con ISO 9001 & ISO 45001:2018
          </div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Alta Ingeniería para la <span style={{ color: '#3b82f6' }}>Industria 4.0</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '3rem', lineHeight: 1.6, maxWidth: '800px', margin: '0 auto 3rem' }}>
            Diseño, mantenimiento y suministro de tecnologías avanzadas para separación sólido-líquido. Soluciones robustas para Minería, Saneamiento y Sector Químico.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#contacto" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>Solicitar Cotización <Send size={18} /></a>
            <a href="https://wa.me/51956710062" target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>Atención Inmediata</a>
          </div>
        </div>
      </section>

      {/* 2. SECTION: INDICADORES CORPORATIVOS */}
      <section style={{ padding: '4rem 5%', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
          {[
            { value: '+25', label: 'Años de Experiencia' },
            { value: 'ISO 9001', label: 'Certificación Calidad' },
            { value: '+150', label: 'Proyectos Ejecutados' },
            { value: '24/7', label: 'Soporte Especializado' }
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{stat.value}</h3>
              <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: QUIÉNES SOMOS */}
      <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 500px' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Conózcanos</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: '0.5rem' }}>Líderes en Procesos Metalúrgicos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Dewatering Solutions nació con el propósito de optimizar los procesos de separación sólido-líquido en el sector minero e industrial. Nuestra experiencia combinada con tecnología de punta nos permite ofrecer soluciones rentables, eficientes y seguras.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 500 }}><CheckCircle2 size={18} color="var(--success)"/> Soluciones a medida (Llave en mano)</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 500 }}><CheckCircle2 size={18} color="var(--success)"/> Red de aliados tecnológicos internacionales</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)', fontWeight: 500 }}><CheckCircle2 size={18} color="var(--success)"/> Compromiso con el medio ambiente</li>
            </ul>
            <Link to="/nosotros" className="btn btn-primary">Descubra Nuestra Historia <ArrowRight size={16}/></Link>
          </div>
          <div style={{ flex: '1 1 400px', height: '400px', borderRadius: 'var(--radius-xl)', background: 'var(--accent-gradient)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={80} color="rgba(255,255,255,0.2)" />
            <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>"Innovación y eficiencia para la industria del futuro."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: SERVICIOS DESTACADOS */}
      <section id="servicios" style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Especialidades</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0 1rem' }}>Nuestros Servicios</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>Cubrimos todas las etapas del proceso garantizando eficiencia y rentabilidad para sus operaciones.</p>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando servicios...</div>
          ) : (
            <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {services.map(service => (
                <Link to={`/servicios`} key={service.id} className="card hover-float" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    {service.category_slug === 'filtracion' ? <Filter size={24} /> : 
                     service.category_slug === 'espesamiento' ? <Layers size={24} /> : 
                     service.category_slug === 'flotacion' ? <Waves size={24} /> : <Droplets size={24} />}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{service.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{service.short_description}</p>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>Ver detalles <ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/servicios" className="btn btn-ghost">Ver Todos los Servicios</Link>
          </div>
        </div>
      </section>

      {/* 5. SECTION: PRODUCTOS Y EQUIPOS */}
      <section id="equipos" style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Suministro</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.5rem 0 1rem' }}>Catálogo de Equipos</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Maquinaria industrial de última generación proveniente de Italia y Sudáfrica.</p>
            </div>
            <Link to="/productos" className="btn btn-primary">Catálogo Completo <ArrowRight size={16}/></Link>
          </div>

          {loading ? null : (
            <div className="grid-2">
              {products.map(product => (
                <div key={product.id} className="card hover-float" style={{ display: 'flex', padding: '1.5rem', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ width: '120px', height: '120px', background: 'var(--bg-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                    <Factory size={48} color="var(--text-secondary)" opacity={0.3} />
                  </div>
                  <div>
                    <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>{product.category}</span>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{product.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{product.short_description}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={14} /> Origen: {product.origin}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. SECTION: EXPERIENCIA Y PROYECTOS */}
      <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Experiencia Comprobada</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>Conozca cómo hemos resuelto desafíos complejos en plantas mineras de primer nivel.</p>
          <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card hover-float" style={{ overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '200px', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Target size={48} color="var(--text-secondary)" opacity={0.2} />
                </div>
                <div style={{ padding: '1.5rem', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Proyecto Industrial #{i}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Instalación y puesta en marcha de planta de filtración de relaves a gran escala.</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem' }}>
            <Link to="/proyectos" className="btn btn-ghost">Ver Galería de Proyectos</Link>
          </div>
        </div>
      </section>

      {/* 7. SECTION: CERTIFICACIONES Y CALIDAD */}
      <section style={{ padding: '4rem 5%', backgroundColor: 'var(--accent-secondary)', color: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Award size={48} opacity={0.9} />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>ISO 9001:2015</h3>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Sistemas de Gestión de Calidad</p>
            </div>
          </div>
          <div style={{ width: '1px', height: '50px', background: 'rgba(255,255,255,0.2)' }} className="hide-mobile"></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldCheck size={48} opacity={0.9} />
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Seguridad Industrial</h3>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Cero accidentes en 5 años consecutivos</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SECTION: CLIENTES Y SECTORES (SLIDER INFINITO) */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)', textAlign: 'center', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', padding: '0 5%' }}>
          Confían en Dewatering Solutions
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', padding: '0 5%' }}>
          Acompañamos a las principales empresas de la región en sus procesos más críticos.
        </p>

        {/* TRACK 1: Clientes */}
        <div className="marquee-container" style={{ marginBottom: '2rem' }}>
          <div className="marquee-content">
            {[
              { id: 'antamina', src: '/clients/antamina.png', alt: 'Antamina' },
              { id: 'cerroverde', src: '/clients/cerroverde.png', alt: 'Cerro Verde' },
              { id: 'lasbambas', src: '/clients/lasbambas.png', alt: 'Las Bambas' },
              { id: 'sedapal', src: '/clients/sedapal.png', alt: 'Sedapal' },
              { id: 'southern', src: '/clients/southern.png', alt: 'Southern Copper' },
              { id: 'buenaventura', src: '/clients/buenaventura.png', alt: 'Buenaventura' },
              { id: 'chinalco', src: '/clients/chinalco.png', alt: 'Chinalco' },
              { id: 'antamina2', src: '/clients/antamina.png', alt: 'Antamina' },
              { id: 'cerroverde2', src: '/clients/cerroverde.png', alt: 'Cerro Verde' },
              { id: 'lasbambas2', src: '/clients/lasbambas.png', alt: 'Las Bambas' },
              { id: 'sedapal2', src: '/clients/sedapal.png', alt: 'Sedapal' },
              { id: 'southern2', src: '/clients/southern.png', alt: 'Southern Copper' },
              { id: 'buenaventura2', src: '/clients/buenaventura.png', alt: 'Buenaventura' },
              { id: 'chinalco2', src: '/clients/chinalco.png', alt: 'Chinalco' }
            ].map((client, idx) => (
              <div key={idx} className="marquee-item" style={{ background: 'transparent', border: 'none', padding: '0 2rem', boxShadow: 'none' }}>
                <img 
                  src={client.src} 
                  alt={client.alt} 
                  style={{ 
                    height: '55px', 
                    width: 'auto', 
                    filter: 'grayscale(100%) opacity(0.5)', 
                    transition: 'all 0.4s ease',
                    cursor: 'pointer'
                  }} 
                  onMouseOver={e => e.currentTarget.style.filter = 'grayscale(0%) opacity(1)'} 
                  onMouseOut={e => e.currentTarget.style.filter = 'grayscale(100%) opacity(0.5)'} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* TRACK 2: Sectores (Reverse) */}
        <div className="marquee-container">
          <div className="marquee-content reverse">
            {[
              'Sector Minero', 'Tratamiento de Aguas', 'Industria Metalúrgica', 
              'Procesos Químicos', 'Agroindustria', 'Ingeniería Civil',
              'Sector Minero', 'Tratamiento de Aguas', 'Industria Metalúrgica', 
              'Procesos Químicos', 'Agroindustria', 'Ingeniería Civil'
            ].map((sector, idx) => (
              <div key={idx} className="marquee-item" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <Target size={20} color="var(--accent-primary)" /> {sector}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SECTION: CONTACTO RÁPIDO */}
      <section id="contacto" style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Impulsamos la eficiencia de su planta</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Déjenos sus datos y un ingeniero especializado se pondrá en contacto para evaluar sus requerimientos técnicos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={20} /></div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Correo Comercial</div>
                  ventas@dewateringsolutions.com.pe
                </div>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 400px' }}>
            <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-primary)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Solicitar Evaluación</h3>
              
              {formStatus.status === 'success' ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--success)', background: 'rgba(16,185,129,0.1)', borderRadius: '12px' }}>
                  <CheckCircle2 size={48} style={{ margin: '0 auto 1rem' }} />
                  <h4>{formStatus.message}</h4>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="input-group">
                    <label className="input-label">Nombre Completo</label>
                    <input type="text" className="input-control" name="contact_name" value={formData.contact_name} onChange={handleInputChange} required placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Correo Corporativo</label>
                    <input type="email" className="input-control" name="contact_email" value={formData.contact_email} onChange={handleInputChange} required placeholder="juan@empresa.com" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Empresa</label>
                    <input type="text" className="input-control" name="company_name" value={formData.company_name} onChange={handleInputChange} required placeholder="Minera XYZ" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Servicio de Interés</label>
                    <select className="input-control" name="service_interest" value={formData.service_interest} onChange={handleInputChange} required>
                      <option value="">Seleccione una opción</option>
                      <option value="Filtración">Filtración</option>
                      <option value="Espesamiento">Espesamiento</option>
                      <option value="Flotación">Flotación</option>
                      <option value="Equipos">Compra de Equipos</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mensaje (Opcional)</label>
                    <textarea className="input-control" name="message" value={formData.message} onChange={handleInputChange} rows="3" placeholder="Detalle su requerimiento..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-full" disabled={formStatus.status === 'loading'} style={{ marginTop: '1rem', padding: '0.85rem' }}>
                    {formStatus.status === 'loading' ? 'Enviando...' : 'Enviar Solicitud'}
                  </button>
                  {formStatus.status === 'error' && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>{formStatus.message}</p>}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
