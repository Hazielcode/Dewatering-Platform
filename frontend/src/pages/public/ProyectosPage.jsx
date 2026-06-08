import React from 'react';
import { Target, MapPin, CheckCircle, Award } from 'lucide-react';

const ProyectosPage = () => {
  const proyectos = [
    {
      titulo: 'Planta de Filtrado de Relaves Chungar',
      cliente: 'VOLCAN',
      pais: 'Perú',
      tipo: 'Filtración a Presión',
      desc: 'Implementación y soporte en la planta de filtrado para el manejo eficiente de relaves mineros.'
    },
    {
      titulo: 'Pilotaje Tierras Raras con Carbonato',
      cliente: 'Biolantánidos',
      pais: 'Chile',
      tipo: 'Planta Piloto de Lixiviación',
      desc: 'Desarrollo de pilotaje especializado para la extracción y recuperación de tierras raras.'
    },
    {
      titulo: 'Tratamiento de Aguas Ácidas',
      cliente: 'Minera Shahuindo',
      pais: 'Perú',
      tipo: 'Planta Piloto Móvil',
      desc: 'Pruebas de neutralización, oxidación y sedimentación usando nuestra unidad móvil de tratamiento.'
    },
    {
      titulo: 'Planta de Filtración de Salmueras de Litio',
      cliente: 'Punamining',
      pais: 'Argentina',
      tipo: 'Comisionamiento',
      desc: 'Instalación, comisionamiento y pruebas de laboratorio para la recuperación de litio.'
    },
    {
      titulo: 'Auditorías de Proceso Metalúrgico',
      cliente: 'Cerro Verde y Marcobre',
      pais: 'Perú',
      tipo: 'Auditoría',
      desc: 'Evaluación y optimización de las etapas de separación sólido-líquido en grandes operaciones de cobre.'
    },
    {
      titulo: 'Diseño e Ingeniería de Planta Paltarrumi',
      cliente: 'Paltarrumi',
      pais: 'Perú',
      tipo: 'Ingeniería',
      desc: 'Diseño de la Planta de sedimentación y filtración de concentrado.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '6rem 5% 4rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ width: 60, height: 60, borderRadius: '15px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
            <Award size={30} />
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            Experiencia y Casos de Éxito
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Nuestra experiencia internacional nos permite abordar los proyectos más complejos de la minería moderna con soluciones comprobadas y resultados medibles.
          </p>
        </div>
      </section>

      {/* GALERIA DE PROYECTOS */}
      <section style={{ padding: '2rem 5% 6rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          
          {proyectos.map((proy, i) => (
            <div key={i} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                  {proy.tipo}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <MapPin size={14} /> {proy.pais}
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {proy.titulo}
              </h2>
              <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>
                Cliente: {proy.cliente}
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {proy.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default ProyectosPage;
