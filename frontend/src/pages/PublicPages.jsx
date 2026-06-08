import React from 'react';
import NosotrosPageReal from './public/NosotrosPage.jsx';
import ServiciosPageReal from './public/ServiciosPage.jsx';
import ProductosPageReal from './public/ProductosPage.jsx';
import ProyectosPageReal from './public/ProyectosPage.jsx';

const PagePlaceholder = ({ title }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
      Esta página está actualmente en construcción como parte del despliegue de la Fase 2 de nuestro portal corporativo.
    </p>
  </div>
);

export const NosotrosPage = NosotrosPageReal;
export const ServiciosPage = ServiciosPageReal;
export const ProductosPage = ProductosPageReal;
export const CapacitacionesPage = () => <PagePlaceholder title="Capacitaciones Técnicas" />;
export const ProyectosPage = ProyectosPageReal;
export const DescargasPage = () => <PagePlaceholder title="Centro de Descargas" />;
export const BlogPage = () => <PagePlaceholder title="Blog Técnico" />;
export const ContactoPage = () => <PagePlaceholder title="Contacto Rápido" />;
