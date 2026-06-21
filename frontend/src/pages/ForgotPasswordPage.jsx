import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [recoveryOptions, setRecoveryOptions] = useState(null);

  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/check-recovery', { email });
      setRecoveryOptions(response.data);
      setStep(2);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Error al buscar el correo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestSupport = () => {
    // In a real scenario, this would send an email to the admin or create a ticket
    setSuccessMsg('Se ha enviado una notificación al administrador. En breve nos contactaremos contigo para reestablecer tu acceso.');
    setStep(3);
  };

  const handleSendBackupEmail = () => {
    // In a real scenario, this would trigger a password reset email
    setSuccessMsg(`Se ha enviado un enlace de recuperación a tu correo de respaldo: ${recoveryOptions.masked_backup}`);
    setStep(3);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Panel Izquierdo — Branding */}
      <div className="branding-panel" style={{
        flex: 1.3,
        background: 'linear-gradient(160deg, #1a365d 0%, #2563eb 60%, #1e40af 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '5rem', color: 'white', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '550px' }}>
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
            <img className="logo-dark-bg" src="/logodewatering.png" alt="Dewatering Solutions" style={{ height: '180px', width: 'auto', objectFit: 'contain', transform: 'scale(1.3)', transformOrigin: 'left center' }} />
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
            Recuperación<br />de Acceso.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.7, maxWidth: '420px', fontWeight: 400 }}>
            Reestablezca su contraseña de forma segura utilizando nuestras herramientas de verificación.
          </p>
        </div>
      </div>

      {/* Panel Derecho — Formulario */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '2.5rem', backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
          <Link to="/login" className="btn-ghost text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
            ← Volver al Login
          </Link>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem', borderRadius: '28px', position: 'relative' }}>
            
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Recuperar Contraseña
              </h2>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>
                {step === 1 ? 'Ingrese su correo corporativo para continuar' : step === 2 ? 'Seleccione un método de recuperación' : 'Solicitud Procesada'}
              </p>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.15)', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}
            
            {successMsg && (
              <div style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(16,185,129,0.15)', fontWeight: 500, lineHeight: 1.5 }}>
                {successMsg}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleCheckEmail}>
                <div className="input-group">
                  <label className="input-label">Correo Electrónico Corporativo</label>
                  <input type="email" className="input-control" placeholder="usuario@empresa.com" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{ borderRadius: '14px', padding: '0.8rem 1.1rem' }}/>
                </div>
                <button type="submit" className="btn btn-primary w-full" disabled={isLoading}
                  style={{ padding: '0.85rem', fontSize: '0.92rem', borderRadius: '14px', marginTop: '1rem' }}>
                  {isLoading ? 'Buscando cuenta...' : 'Continuar'}
                </button>
              </form>
            )}

            {step === 2 && recoveryOptions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {recoveryOptions.has_backup && (
                  <button onClick={handleSendBackupEmail} className="btn-ghost" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', background: 'var(--bg-secondary)', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      Enviar Enlace al Correo de Respaldo
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Se enviará un código a: <strong>{recoveryOptions.masked_backup}</strong>
                    </span>
                  </button>
                )}

                {recoveryOptions.has_mfa && (
                  <button onClick={() => {}} className="btn-ghost" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', background: 'var(--bg-secondary)', transition: 'all 0.2s', opacity: 0.6, cursor: 'not-allowed' }} disabled>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                      Usar Código Authenticator (MFA)
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Próximamente disponible
                    </span>
                  </button>
                )}

                <button onClick={handleRequestSupport} className="btn-ghost" style={{ padding: '1.2rem', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', background: 'var(--bg-secondary)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    Contactar a Soporte Técnico
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    El administrador se pondrá en contacto para verificar tu identidad.
                  </span>
                </button>

              </div>
            )}

            {step === 3 && (
               <Link to="/login" className="btn btn-primary w-full" style={{ padding: '0.85rem', fontSize: '0.92rem', borderRadius: '14px', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                 Volver al Inicio de Sesión
               </Link>
            )}

          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .branding-panel { display: none !important; } }`}</style>
    </div>
  );
};

export default ForgotPasswordPage;
