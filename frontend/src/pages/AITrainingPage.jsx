import React, { useState, useEffect, useRef } from 'react';
import { BrainCircuit, Database, FileText, Upload, Plus, Trash2, CheckCircle, AlertTriangle, FileUp, FileImage, ChevronDown, ChevronRight } from 'lucide-react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout.jsx';
import Swal from 'sweetalert2';

const AITrainingPage = () => {
  const [sourceName, setSourceName] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'file'
  const [isTraining, setIsTraining] = useState(false);
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const [trainedDocs, setTrainedDocs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isJobsVisible, setIsJobsVisible] = useState(false);

  useEffect(() => {
    fetchTrainedDocs();
    fetchJobs();
    
    // Polling cada 5 segundos para actualizar los trabajos en segundo plano
    const intervalId = setInterval(() => {
      fetchJobs();
      fetchTrainedDocs();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchTrainedDocs = async () => {
    try {
      const response = await api.get('/ai/trained-docs');
      setTrainedDocs(response.data);
    } catch (error) {
      console.error('Error fetching docs', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/ai/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs', error);
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
      
      setStatus({ type: 'success', message: response.data.message });
      fetchJobs();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.error || 'Error al subir el archivo' });
    } finally {
      setIsTraining(false);
      setTimeout(() => setStatus(null), 6000);
    }
  };

  const handleDeleteDoc = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Eliminarás este conocimiento permanentemente de la IA.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/ai/trained-docs/${id}`);
      fetchTrainedDocs();
      Swal.fire({
        title: 'Eliminado',
        text: 'El documento fue borrado del conocimiento.',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });
    } catch (error) {
      console.error('Error al eliminar el documento', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo eliminar el documento.',
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  const handleDeleteJob = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar proceso?',
      text: "Quitarás este proceso de la lista de pendientes/fallidos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/ai/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Error al eliminar el job', error);
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar el proceso.', icon: 'error' });
    }
  };

  return (
    <DashboardLayout 
      title="Centro de Entrenamiento IA" 
      subtitle="Memoria Base y Conocimiento Institucional para el Chatbot"
    >
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', alignItems: 'start' }}>
        
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
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Título de la Información</label>
                <input 
                  type="text" value={sourceName} onChange={e => setSourceName(e.target.value)}
                  placeholder="Ej. Promoción Filtros 2026" className="input-field" required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Contenido Técnico (Texto Plano)</label>
                <textarea 
                  value={textContent} onChange={e => setTextContent(e.target.value)}
                  placeholder="Pega aquí especificaciones, preguntas frecuentes, políticas..."
                  className="input-field" style={{ minHeight: '220px', resize: 'vertical' }} required
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={isTraining || !sourceName || !textContent} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {isTraining ? <><BrainCircuit size={20} className="animate-spin" /> Procesando...</> : <><Database size={20} /> Entrenar Modelo IA</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTrainFile} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Título (Opcional, si está vacío usa el nombre del archivo)</label>
                <input 
                  type="text" value={sourceName} onChange={e => setSourceName(e.target.value)}
                  placeholder="Ej. Manual Bombas PEMO" className="input-field"
                />
              </div>
              
              <div 
                style={{
                  border: '2px dashed var(--accent-primary)', borderRadius: '16px', padding: '3.5rem 2rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'var(--accent-light)', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.3s ease', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-light)'; e.currentTarget.style.transform = 'translateY(0)' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" ref={fileInputRef} style={{ display: 'none' }}
                  accept=".pdf,.docx,.jpg,.jpeg,.png"
                  onChange={e => setSelectedFile(e.target.files[0])}
                />
                <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <FileImage size={36} color="var(--accent-primary)" />
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)', fontSize: '1.1rem' }}>
                  {selectedFile ? selectedFile.name : 'Haz clic o arrastra un archivo aquí'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {selectedFile ? `(${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)` : 'Soporta PDF, Word (docx), JPG y PNG'}
                </p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isTraining || !selectedFile} style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {isTraining ? <><BrainCircuit size={20} className="animate-spin" /> Subiendo al Storage...</> : <><Database size={20} /> Subir y Entrenar IA (Segundo Plano)</>}
              </button>
            </form>
          )}
        </div>

        {/* SIDEBAR DERECHO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {jobs.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', border: '2px solid var(--accent-light)' }}>
              <div 
                onClick={() => setIsJobsVisible(!isJobsVisible)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: isJobsVisible ? '1px solid var(--border-color)' : 'none', paddingBottom: isJobsVisible ? '0.5rem' : '0' }}
              >
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BrainCircuit size={18} color="var(--accent-primary)" /> Procesos en Segundo Plano
                </h3>
                {isJobsVisible ? <ChevronDown size={20} color="var(--text-secondary)"/> : <ChevronRight size={20} color="var(--text-secondary)"/>}
              </div>
              {isJobsVisible && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                {jobs.map(job => (
                  <div key={job.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                        {job.file_name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ 
                          fontSize: '0.7rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                          backgroundColor: job.status === 'COMPLETED' ? 'rgba(16,185,129,0.1)' : job.status === 'FAILED' ? 'rgba(239,68,68,0.1)' : 'rgba(54,124,252,0.1)',
                          color: job.status === 'COMPLETED' ? '#10b981' : job.status === 'FAILED' ? '#ef4444' : 'var(--accent-primary)'
                        }}>
                          {job.status}
                        </span>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '2px' }}
                          title="Limpiar de la lista"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {job.status !== 'COMPLETED' && job.status !== 'FAILED' && (
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${job.progress}%`, height: '100%', backgroundColor: 'var(--accent-primary)', transition: 'width 0.5s' }} />
                      </div>
                    )}
                    {job.error_message && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: 'var(--danger)', 
                        display: '-webkit-box', 
                        WebkitLineClamp: 2, 
                        WebkitBoxOrient: 'vertical', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis' 
                      }}>
                        {job.error_message.includes('code":404') ? 'El modelo de IA solicitado no está disponible temporalmente.' : job.error_message.includes('dimensions') ? 'Error de compatibilidad de dimensiones con la BD.' : job.error_message}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Conocimiento Actual
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {trainedDocs.map(doc => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <FileText size={18} color="var(--accent-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1, overflow: 'hidden', paddingRight: '20px' }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {doc.name}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>~{doc.tokens} tokens</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteDoc(doc.id)}
                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.7, padding: '4px' }}
                    title="Eliminar este conocimiento"
                    onMouseOver={e => e.currentTarget.style.opacity = 1}
                    onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                  >
                    <Trash2 size={16} />
                  </button>
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
    </DashboardLayout>
  );
};

export default AITrainingPage;
