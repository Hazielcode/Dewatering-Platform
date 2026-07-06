import React, { useState, useEffect } from 'react';
import { BrainCircuit, Database, FileText, Upload, Plus, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../services/api';

const AITrainingPage = () => {
  const [sourceName, setSourceName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const [trainedDocs, setTrainedDocs] = useState([]);

  // Cargar documentos entrenados al montar
  useEffect(() => {
    fetchTrainedDocs();
  }, []);

  const fetchTrainedDocs = async () => {
    try {
      const response = await api.get('/ai/trained-docs');
      setTrainedDocs(response.data);
    } catch (error) {
      console.error('Error fetching docs', error);
    }
  };

  const handleTrain = async (e) => {
    e.preventDefault();
    if (!sourceName.trim() || !textContent.trim()) return;
    
    setIsTraining(true);
    setStatus(null);

    try {
      const response = await api.post('/ai/train', {
        sourceName,
        textContent
      });
      
      setSourceName('');
      setTextContent('');
      setStatus({ type: 'success', message: `¡Conocimiento inyectado exitosamente! (${response.data.chunksProcessed} fragmentos)` });
      fetchTrainedDocs(); // Refrescar lista
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Error al entrenar la IA' });
    } finally {
      setIsTraining(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
        
        {/* FORMULARIO DE ENTRENAMIENTO */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(54,124,252,0.3)' }}>
              <BrainCircuit size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Inyectar Conocimiento (Memoria Base)</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Convierte textos planos en vectores matemáticos para el Chatbot Público.
              </p>
            </div>
          </div>

          {status && (
            <div style={{ 
              padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px',
              backgroundColor: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`
            }}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              <span style={{ fontWeight: 600 }}>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleTrain} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Título o Fuente de la Información
              </label>
              <input 
                type="text" 
                value={sourceName}
                onChange={e => setSourceName(e.target.value)}
                placeholder="Ej. Manual Operativo Filtro Prensa 2026"
                className="input-field"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Contenido Técnico (Texto Plano)
              </label>
              <textarea 
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                placeholder="Pega aquí todo el texto, especificaciones técnicas, historias, etc. El sistema lo dividirá en chunks (fragmentos) automáticamente..."
                className="input-field"
                style={{ minHeight: '250px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.9rem' }}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isTraining || !sourceName || !textContent}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}
            >
              {isTraining ? (
                <>
                  <BrainCircuit size={20} className="animate-spin" style={{ animation: 'spin 2s linear infinite' }} />
                  Procesando Embeddings...
                </>
              ) : (
                <>
                  <Database size={20} /> Entrenar Modelo IA
                </>
              )}
            </button>
          </form>
        </div>

        {/* SIDEBAR DERECHO: ESTADÍSTICAS Y DOCUMENTOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', border: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--accent-primary)" /> Estado de la BD Vectorial
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Total de Fragmentos:</span>
              <span style={{ fontWeight: 700 }}>245 chunks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Dimensión Vectorial:</span>
              <span style={{ fontWeight: 700 }}>768 (Gemini)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Motor de Búsqueda:</span>
              <span style={{ fontWeight: 700, color: '#4ade80' }}>pgvector HNSW</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Conocimiento Actual
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trainedDocs.map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <FileText size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {doc.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>~{doc.tokens} tokens</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <button className="btn-ghost" style={{ padding: '4px', color: 'var(--danger)' }} title="Eliminar Vectores">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AITrainingPage;
