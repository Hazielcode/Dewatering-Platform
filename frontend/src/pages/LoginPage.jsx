import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../App.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import DewateringMascot from '../components/DewateringMascot.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const { login } = useAuth();
  
  // Use state passed from Register page if available
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState(location.state?.password || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true); setErrorMsg('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.mfaRequired) {
        navigate('/mfa', { state: { email: response.data.email, userId: response.data.userId } });
        return;
      } else {
        // Usar AuthContext para login
        login(response.data.token, response.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMsg(error.response.data.error || 'Credenciales inválidas');
      } else {
        setErrorMsg('Error de red: ¿Está encendido el servidor backend?');
      }
    } finally { setIsLoading(false); }
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
            Soluciones<br/>Sólido-Líquido<br/>Especializadas.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.7, maxWidth: '420px', fontWeight: 400 }}>
            Especialistas en filtración, espesamiento y tratamiento de aguas para la industria minera e industrial con más de 25 años de experiencia.
          </p>
        </div>

        {/* Decoración de fondo */}
        <div style={{ position: 'absolute', top: '-15%', right: '-15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '3rem', left: '5rem', fontSize: '0.85rem', opacity: 0.5 }}>
          © {new Date().getFullYear()} Dewatering Solutions
        </div>
      </div>

      {/* Panel Derecho — Formulario */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '2.5rem', backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={toggleTheme} className="btn-ghost" style={{ width: 40, height: 40, borderRadius: '12px' }}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '430px', padding: '3rem', borderRadius: '28px', position: 'relative' }}>
            
            {/* EL MUÑECO / MASCOTA */}
            <DewateringMascot 
              isPasswordFocused={isPasswordFocused} 
              hasError={!!errorMsg} 
              mouseX={mousePos.x} 
              mouseY={mousePos.y} 
            />

            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Bienvenido</h2>
              <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Ingrese sus credenciales corporativas</p>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--danger)', padding: '0.85rem 1rem', borderRadius: '14px', marginBottom: '1.5rem', fontSize: '0.85rem', border: '1px solid rgba(239,68,68,0.15)', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label className="input-label">Correo Electrónico</label>
                <input type="email" className="input-control" placeholder="usuario@dewatering.com" required
                  value={email} onChange={e => setEmail(e.target.value)}
                  style={{ borderRadius: '14px', padding: '0.8rem 1.1rem' }}/>
              </div>
              <div className="input-group">
                <label className="input-label">Contraseña</label>
                <input type="password" className="input-control" placeholder="••••••••" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  style={{ borderRadius: '14px', padding: '0.8rem 1.1rem' }}/>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }} />
                  Recordar sesión
                </label>
                <a href="#" style={{ color: 'var(--accent-primary)', fontSize: '0.82rem', textDecoration: 'none', fontWeight: 600 }}>
                  ¿Olvidó su contraseña?
                </a>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isLoading}
                style={{ padding: '0.85rem', fontSize: '0.92rem', borderRadius: '14px' }}>
                {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ¿No tiene cuenta?{' '}
              <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Regístrese aquí</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px) { .branding-panel { display: none !important; } }`}</style>
    </div>
  );
};

export default LoginPage;
