import React from 'react';
import { Target, Eye, Shield, CheckCircle, Users, Zap, Award, BookOpen } from 'lucide-react';

const NosotrosPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* HERO SECTION */}
      <section style={{
        background: 'linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url("https://images.unsplash.com/photo-1574684065660-84dc096eeb85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '6rem 5%',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Nuestra Historia
          </h1>
          <p style={{ fontSize: '1.3rem', color: '#cbd5e1', lineHeight: 1.6, fontWeight: 300 }}>
            Ayudar a nuestros clientes a optimizar sus procesos mediante soluciones técnicas confiables, contribuyendo a una operación más eficiente, sostenible y competitiva.
          </p>
        </div>
      </section>

      {/* HISTORIA (TIMELINE) */}
      <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' }}>
              Evolución y Crecimiento
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              <p>
                <strong>Dewatering Solutions</strong> fue fundada en <strong>agosto de 2017</strong> con el objetivo de atender una necesidad recurrente de la industria minera y de otros sectores industriales: encontrar soluciones eficientes a los desafíos asociados a la separación sólido-líquido.
              </p>
              <p>
                Los socios fundadores identificaron que muchas operaciones requerían soporte técnico especializado para optimizar procesos de espesamiento, filtración y manejo de relaves. Como respuesta, iniciaron actividades con un pequeño laboratorio enfocado en pruebas técnicas.
              </p>
              <p>
                Actualmente, contamos con un laboratorio metalúrgico especializado capaz de desarrollar estudios avanzados, complementado con áreas de ingeniería básica, fabricación metalmecánica, montaje de equipos industriales y comisionamiento en planta.
              </p>
            </div>
          </div>
          <div style={{ 
            borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            height: '100%', minHeight: '400px', position: 'relative'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Ingeniería en planta" 
              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            />
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          
          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '5px solid var(--accent-primary)' }}>
            <div style={{ width: 60, height: 60, borderRadius: '15px', backgroundColor: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Target size={30} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Nuestra Misión</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Somos una empresa especializada en soluciones de separación sólido-líquido, análisis metalúrgicos y tratamiento de aguas. Brindamos resultados confiables mediante personal altamente capacitado e infraestructura especializada, contribuyendo a la optimización de procesos y a la toma de decisiones.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-primary)', padding: '3rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderTop: '5px solid #10b981' }}>
            <div style={{ width: 60, height: 60, borderRadius: '15px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Eye size={30} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>Nuestra Visión</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Ser reconocidos como una empresa líder y altamente especializada en separación sólido-líquido para minería e industria, destacando por la calidad técnica de nuestros servicios, innovación aplicada y el estricto cumplimiento de estándares internacionales de gestión.
            </p>
          </div>

        </div>
      </section>

      {/* VALORES CORPORATIVOS */}
      <section style={{ padding: '6rem 5%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Valores Corporativos</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Principios que rigen nuestra conducta técnica, operativa y comercial.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Shield, title: 'Responsabilidad', desc: 'Asumimos cada proyecto garantizando el cumplimiento de objetivos y calidad.' },
              { icon: CheckCircle, title: 'Honradez y Ética', desc: 'Actuamos con integridad en todas nuestras relaciones comerciales.' },
              { icon: Users, title: 'Respeto', desc: 'Promovemos relaciones basadas en confianza mutua con clientes y proveedores.' },
              { icon: Award, title: 'Integridad', desc: 'Mantenemos coherencia entre nuestros principios, decisiones y acciones.' },
              { icon: Target, title: 'Compromiso', desc: 'Orientamos esfuerzos a generar soluciones efectivas que aporten valor.' },
              { icon: Zap, title: 'Trabajo en Equipo', desc: 'Fomentamos la convergencia de esfuerzos y capacidades para mejores resultados.' },
              { icon: BookOpen, title: 'Excelencia e Innovación', desc: 'Impulsamos la mejora continua de procesos técnicos desarrollando nuevas soluciones.' }
            ].map((valor, i) => (
              <div key={i} style={{ padding: '2rem', borderRadius: '15px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', transition: 'transform 0.3s' }}>
                <valor.icon size={28} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{valor.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{valor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FILOSOFÍA / CTA */}
      <section style={{ padding: '5rem 5%', backgroundColor: 'var(--accent-primary)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Nuestra Filosofía Empresarial</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', opacity: 0.9 }}>
            Creemos que las mejores soluciones nacen de la combinación entre experiencia práctica, conocimiento técnico y compromiso con los resultados. Acompañamos a nuestros clientes desde la evaluación inicial hasta la implementación y optimización.
          </p>
          <div style={{ height: '2px', width: '60px', backgroundColor: 'white', opacity: 0.5, margin: '0 auto' }}></div>
        </div>
      </section>

    </div>
  );
};

export default NosotrosPage;
