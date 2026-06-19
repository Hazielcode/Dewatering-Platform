import React from 'react';
import { FlaskConical, Droplets, Wrench, Microscope, Settings, ChevronRight } from 'lucide-react';

const ServiciosPage = () => {

  const categorias = [
    {
      titulo: "Pruebas y Ensayos de Laboratorio",
      icono: Microscope,
      color: "#3b82f6",
      img: '/images/laboratorio.webp',
      servicios: [
        "Ensayos de sedimentación y espesamiento.",
        "Ensayos de filtración a presión.",
        "Ensayos de reología de pulpas minerales.",
        "Selección y evaluación de floculantes.",
        "Ensayos de flotación.",
        "Ensayos de lixiviación.",
        "Caracterización metalúrgica.",
        "Granulometría láser.",
        "Blending de reactivos."
      ]
    },
    {
      titulo: "Pilotajes y Tratamiento de Aguas",
      icono: Droplets,
      color: "#10b981",
      img: '/images/planta-movil.webp',
      servicios: [
        "Pilotajes de tratamiento de aguas ácidas.",
        "Pilotajes de detoxificación.",
        "Pilotajes de filtración y espesamiento."
      ]
    },
    {
      titulo: "Ingeniería y Soporte Industrial",
      icono: Wrench,
      color: "#f59e0b",
      img: '/images/mantenimiento.webp',
      servicios: [
        "Soporte metalúrgico.",
        "Montaje industrial.",
        "Puesta en marcha.",
        "Overhaul y mantenimiento.",
        "Fabricación metalmecánica."
      ]
    }
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
            <Settings size={30} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Catálogo de Servicios Especializados
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            En Dewatering Solutions trabajamos para convertir los desafíos operacionales de nuestros clientes en oportunidades de mejora. Brindamos soluciones integrales respaldadas por conocimiento técnico, compromiso y resultados.
          </p>
        </div>
      </section>

      {/* CATALOGO DE SERVICIOS */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          
          {categorias.map((cat, index) => (
            <div key={index} className="hover-float" style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '250px', backgroundColor: 'var(--border-color)', position: 'relative' }}>
                <img 
                  src={cat.img} 
                  alt={cat.titulo} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80'; }}
                />
              </div>
              <div style={{ padding: '2rem 3rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ width: 50, height: 50, borderRadius: '12px', backgroundColor: `${cat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <cat.icono size={26} color={cat.color} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.titulo}</h2>
              </div>
              
              {/* Lista de Servicios */}
              <div style={{ padding: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {cat.servicios.map((servicio, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ marginTop: '3px' }}>
                      <ChevronRight size={18} color="var(--accent-primary)" />
                    </div>
                    <span style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {servicio}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-secondary)', textAlign: 'center', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <FlaskConical size={48} color="var(--accent-primary)" style={{ margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            ¿Necesita evaluar una muestra o instalar un equipo?
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Nuestro equipo de expertos metalúrgicos e ingenieros de planta está listo para brindarle soporte técnico especializado en su operación minera o industrial.
          </p>
          <a href="#contacto" className="btn btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
            Solicitar Asesoría
          </a>
        </div>
      </section>

    </div>
  );
};

export default ServiciosPage;
