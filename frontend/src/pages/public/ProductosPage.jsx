import React from 'react';
import { Package, Cog, Box, Database, ArrowRight } from 'lucide-react';

const ProductosPage = () => {
  const marcas = [
    {
      nombre: 'Fraccaroli & Balzan',
      pais: 'Italia',
      especialidad: 'Filtros Prensa Automatizados',
      descripcion: 'Equipos full automatizados con opción a monitoreo remoto. Experiencia respaldada por más de 3000 instalaciones alrededor del mundo para tratamiento de lodos y concentrados.',
      productos: ['Filtros Prensa', 'Plantas de Tratamiento de Lodos'],
      img: '/images/filtro-prensa.webp'
    },
    {
      nombre: 'ROYTEC Global',
      pais: 'Sudáfrica',
      especialidad: 'Espesadores y Circuitos',
      descripcion: 'Especialistas en separación sólido-líquido y soluciones de espesamiento para la minería de alto rendimiento.',
      productos: ['Espesadores de Alta Tasa', 'Espesadores de Pasta', 'Circuitos CCD', 'Clarificadores', 'Filtros Banda de Vacío'],
      img: '/images/espesador-roytec.webp'
    },
    {
      nombre: 'Bombas PEMO',
      pais: 'Italia',
      especialidad: 'Bombas para Transferencia de Lodos',
      descripcion: 'Bombas centrífugas diseñadas para las condiciones más abrasivas. Destacan por su diseño de succión lateral que aumenta drásticamente la vida útil del sello.',
      productos: ['Series Horizontales AO/AB', 'Bombas Verticales', 'Bombas Sumergibles', 'Alimentación a Filtros Prensa'],
      img: '/images/bomba-pemo.webp'
    },
    {
      nombre: 'Solids Control',
      pais: 'Global',
      especialidad: 'Centrífugas Industriales',
      descripcion: 'Soluciones de separación mediante fuerza centrífuga para procesos metalúrgicos y químicos de alta exigencia.',
      productos: ['Centrífugas tipo "Pusher"', 'Equipos de separación dinámica'],
      img: '/images/centrifuga.webp'
    }
  ];

  const repuestos = [
    { nombre: 'Placas para Filtros Prensa', desc: 'Fabricación y suministro con certificado de calidad.' },
    { nombre: 'Lonas y Medios Filtrantes', desc: 'Selección de lona óptima según prueba en equipo MONOFASE.' },
    { nombre: 'Reparación de Placas', desc: 'Reparación y reacondicionamiento de placas filtrantes dañadas.' },
    { nombre: 'Fabricación de Repuestos', desc: 'Mecanizado y fabricación de piezas bajo plano.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '6rem 5% 4rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ width: 60, height: 60, borderRadius: '15px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white' }}>
            <Package size={30} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Productos y Equipos Representados
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Representamos a las marcas líderes mundiales en tecnología de separación sólido-líquido, bombeo de lodos y componentes industriales.
          </p>
        </div>
      </section>

      {/* MARCAS PRINCIPALES */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
          
          {marcas.map((marca, i) => (
            <div key={i} className="card hover-float" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', backgroundColor: 'var(--border-color)', position: 'relative' }}>
                <img 
                  src={marca.img} 
                  alt={marca.nombre} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'; }} 
                />
                <span style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'rgba(255,255,255,0.9)', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--text-primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  {marca.pais}
                </span>
              </div>
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{marca.nombre}</h2>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>{marca.especialidad}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>{marca.descripcion}</p>
                
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem' }}>Equipos Destacados:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {marca.productos.map((prod, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        <ArrowRight size={14} color="var(--accent-primary)" /> {prod}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* REPUESTOS Y POST VENTA */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Servicios de Post-Venta y Repuestos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Suministro de consumibles y reacondicionamiento de equipos.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {repuestos.map((rep, i) => (
              <div key={i} style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                <Cog size={30} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{rep.nombre}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{rep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default ProductosPage;
