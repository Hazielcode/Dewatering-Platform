import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Database, FileText, Upload, Plus, Trash2, CheckCircle, AlertTriangle, FileUp, FileImage } from 'lucide-react';
import api from '../services/api';

const AITrainingPage = () => {
  const [sourceName, setSourceName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const [trainedDocs, setTrainedDocs] = useState([]);

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

  const handleTrainText = async (e) => {
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
      fetchTrainedDocs();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Error al entrenar la IA' });
    } finally {
      setIsTraining(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  const handleTrainFile = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsTraining(true);
    setStatus(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (sourceName.trim()) {
      formData.append('sourceName', sourceName);
    }

    try {
      const response = await api.post('/ai/train-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSelectedFile(null);
      setSourceName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      setStatus({ type: 'success', message: `¡Archivo procesado e inyectado! (${response.data.chunksProcessed} fragmentos)` });
      fetchTrainedDocs();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Error al procesar el archivo' });
    } finally {
      setIsTraining(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start', gridTemplateColumns: 'minmax(0, 1fr) 300px' }}>
        
        {/* FORMULARIO DE ENTRENAMIENTO */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(54,124,252,0.3)', flexShrink: 0 }}>
              <BrainCircuit size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Inyectar Conocimiento (Memoria Base)</h2>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Extrae información de Textos, PDFs, Word o Imágenes para el Chatbot.
              </p>
            </div>
          </div>

          {/* TABS */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <button 
              type="button"
              onClick={() => setActiveTab('text')}
              style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'text' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'text' ? '2px solid var(--accent-primary)' : 'none' }}
            >
              <FileText size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }}/> Texto Libre
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('file')}
              style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: activeTab === 'file' ? 'var(--accent-primary)' : 'var(--text-secondary)', borderBottom: activeTab === 'file' ? '2px solid var(--accent-primary)' : 'none' }}
            >
              <FileUp size={16} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'text-bottom' }}/> Subir Archivo
            </button>
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

          {activeTab === 'text' ? (
            <form onSubmit={handleTrainText} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Título de la Información</label>
                <input 
                  type="text" value={sourceName} onChange={e => setSourceName(e.target.value)}
                  placeholder="Ej. Promoción Filtros 2026" className="input-field" required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Contenido Técnico (Texto Plano)</label>
                <textarea 
                  value={textContent} onChange={e => setTextContent(e.target.value)}
                  placeholder="Pega aquí especificaciones, preguntas frecuentes, políticas..."
                  className="input-field" style={{ minHeight: '200px', resize: 'vertical', fontFamily: 'monospace' }} required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isTraining || !sourceName || !textContent} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {isTraining ? <><BrainCircuit size={20} className="animate-spin" /> Procesando...</> : <><Database size={20} /> Entrenar Modelo IA</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTrainFile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>Título (Opcional, si está vacío usa el nombre del archivo)</label>
                <input 
                  type="text" value={sourceName} onChange={e => setSourceName(e.target.value)}
                  placeholder="Ej. Manual Bombas PEMO" className="input-field"
                />
              </div>
              
              <div 
                style={{
                  border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '3rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'var(--bg-secondary)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" ref={fileInputRef} style={{ display: 'none' }}
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  onChange={e => setSelectedFile(e.target.files[0])}
                />
                <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <FileImage size={32} color="var(--accent-primary)" />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                  {selectedFile ? selectedFile.name : 'Haz clic o arrastra un archivo aquí'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {selectedFile ? `(${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Soporta PDF, Word (docx), JPG y PNG'}
                </p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isTraining || !selectedFile} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {isTraining ? <><BrainCircuit size={20} className="animate-spin" /> Analizando Archivo con Visión IA...</> : <><Database size={20} /> Extraer y Entrenar IA</>}
              </button>
            </form>
          )}
        </div>

        {/* SIDEBAR DERECHO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white', border: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--accent-primary)" /> Estado Vectorial
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Total de Fragmentos:</span>
              <span style={{ fontWeight: 700 }}>~{trainedDocs.reduce((acc, d) => acc + (d.tokens/250), 0)} chunks</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Dimensión Vectorial:</span>
              <span style={{ fontWeight: 700 }}>768 (Gemini)</span>
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
                </div>
              ))}
              {trainedDocs.length === 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '1rem 0' }}>No hay conocimiento inyectado aún.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AITrainingPage;
