import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import api from '../services/api.js';
import DewateringMascot from '../components/DewateringMascot.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombres: '', apellidos: '', telefono: '', fecha_nacimiento: '', email: '', password: '', confirmPassword: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mascot states
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (f, v) => { setForm({ ...form, [f]: v }); setErrorMsg(''); };

  const rules = useMemo(() => {
    const p = form.password;
    return [
      { label: 'Mínimo 8 caracteres', valid: p.length >= 8 },
      { label: 'Al menos 1 mayúscula (A-Z)', valid: /[A-Z]/.test(p) },
      { label: 'Al menos 1 número (0-9)', valid: /\d/.test(p) },
      { label: 'Al menos 1 especial (@$!%*?&)', valid: /[@$!%*?&]/.test(p) },
    ];
  }, [form.password]);
  const allPass = rules.every(r => r.valid);
  const match = form.password === form.confirmPassword && form.confirmPassword.length > 0;

  const handleRegister = async (e) => {
    e.preventDefault(); setErrorMsg(''); setSuccessMsg('');
    if (!allPass) { setErrorMsg('La contraseña no cumple los requisitos.'); return; }
    if (!match) { setErrorMsg('Las contraseñas no coinciden.'); return; }
    setIsLoading(true);
    try {
      await api.post('/auth/register', { email: form.email, password: form.password, full_name: `${form.nombres} ${form.apellidos}`, phone: form.telefono });
      setSuccessMsg('Cuenta creada. Redirigiendo a Iniciar Sesión...');
      setTimeout(() => navigate('/login', { state: { email: form.email, password: form.password } }), 2000);
    } catch (err) { setErrorMsg(err.response?.data?.error || 'Error al registrar'); }
    finally { setIsLoading(false); }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Panel Izquierdo — Branding con gradiente Paqari */}
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
            Registro<br />Personal o Corporativo.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.7, maxWidth: '420px', fontWeight: 400 }}>
            Cree su cuenta Personal/orporativa con total seguridad y confianza.
          </p>
        </div>

        {/* Decoración de fondo */}
        <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '3rem', left: '5rem', fontSize: '0.85rem', opacity: 0.5 }}>
          © {new Date().getFullYear()} Dewatering Solutions
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2.5rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Link to="/" className="btn-ghost text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: 600, padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem' }}>
            ← Volver a la Web
          </Link>
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: 450, padding: '2.5rem', borderRadius: 28, position: 'relative' }}>

            {/* EL MUÑECO / MASCOTA */}
            <DewateringMascot
              isPasswordFocused={isPasswordFocused}
              hasError={!!errorMsg}
              mouseX={mousePos.x}
              mouseY={mousePos.y}
            />

            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>Crear Cuenta</h2>
              <p className="text-secondary" style={{ fontSize: '0.88rem' }}>Complete sus datos para el registro</p>
            </div>
            {errorMsg && <div style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 14, marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.15)', fontWeight: 500 }}>{errorMsg}</div>}
            {successMsg && <div style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--success)', padding: '0.75rem 1rem', borderRadius: 14, marginBottom: '1rem', fontSize: '0.85rem', border: '1px solid rgba(16,185,129,0.15)', fontWeight: 500 }}>{successMsg}</div>}

            <form onSubmit={handleRegister}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="input-group" style={{ flex: 1 }}><label className="input-label">Nombres</label><input className="input-control" placeholder="Juan Carlos" required value={form.nombres} onChange={e => handleChange('nombres', e.target.value)} style={{ borderRadius: 14 }} /></div>
                <div className="input-group" style={{ flex: 1 }}><label className="input-label">Apellidos</label><input className="input-control" placeholder="Pérez Gómez" required value={form.apellidos} onChange={e => handleChange('apellidos', e.target.value)} style={{ borderRadius: 14 }} /></div>
              </div>
              <div className="input-group"><label className="input-label">Teléfono Móvil <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>(Opcional)</span></label><input type="tel" className="input-control" placeholder="+51 987 654 321" value={form.telefono} onChange={e => handleChange('telefono', e.target.value)} style={{ borderRadius: 14 }} /></div>
              <div className="input-group"><label className="input-label">Fecha de Nacimiento <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>(Opcional)</span></label><input type="date" className="input-control" value={form.fecha_nacimiento} onChange={e => handleChange('fecha_nacimiento', e.target.value)} style={{ borderRadius: 14 }} /></div>
              <div className="input-group"><label className="input-label">Correo Electrónico</label><input type="email" className="input-control" placeholder="gerencia@empresa.com" required value={form.email} onChange={e => handleChange('email', e.target.value)} style={{ borderRadius: 14 }} /></div>
              <div className="input-group">
                <label className="input-label">Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} className="input-control" placeholder="••••••••" required value={form.password} onChange={e => handleChange('password', e.target.value)} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} style={{ borderRadius: 14, paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {form.password.length > 0 && (
                <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', borderRadius: 16, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Requisitos de Seguridad</p>
                  {rules.map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, transition: 'all 0.2s' }}>
                      {r.valid ? <Check size={14} color="var(--success)" strokeWidth={3} /> : <X size={14} color="var(--danger)" strokeWidth={3} />}
                      <span style={{ fontSize: '0.8rem', fontWeight: 500, color: r.valid ? 'var(--success)' : 'var(--danger)', transition: 'color 0.2s' }}>{r.label}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Confirmar Contraseña</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirmPassword ? 'text' : 'password'} className="input-control" placeholder="••••••••" required value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} style={{ borderRadius: 14, paddingRight: '2.5rem', borderColor: form.confirmPassword.length > 0 ? (match ? 'var(--success)' : 'var(--danger)') : 'var(--border-color)' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading || !allPass || !match} style={{ padding: '0.85rem', fontSize: '0.92rem', borderRadius: 14 }}>
                {isLoading ? 'Creando...' : 'Registrarse'}
              </button>
            </form>
            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ¿Ya tiene cuenta? <Link to="/login" state={{ email: form.email, password: form.password }} style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.branding-panel{display:none!important;}}`}</style>
    </div>
  );
};
export default RegisterPage;
