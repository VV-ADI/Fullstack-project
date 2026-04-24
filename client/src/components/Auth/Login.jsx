import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <main className="flex h-screen w-full">
      {/* Left Side: Visual Context */}
      <section className="hidden lg:flex flex-col w-1/2 relative bg-black overflow-hidden">
        {/* Map Background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-16 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 bg-white flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">SENTINEL LENS</h1>
            </div>
            
            <div className="max-w-xl">
              <p className="text-6xl font-bold leading-[1.1] text-white mb-8">
                Public safety<br/>first.
              </p>
              <p className="text-xl text-white/70 font-normal leading-relaxed max-w-md">
                Real-time containment zone monitoring and proximity alerts for public safety.
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 max-w-md">
            <div className="border-t border-white/20 pt-4">
              <span className="mono text-white/50 text-[10px] uppercase tracking-[0.2em] block mb-2">ACTIVE ZONES</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">Live</span>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4">
              <span className="mono text-white/50 text-[10px] uppercase tracking-[0.2em] block mb-2">STATUS</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success animate-pulse" />
                <span className="text-3xl font-bold text-white tracking-tight">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Overlay */}
        <div className="absolute bottom-8 right-8 z-10">
          <p className="mono text-[9px] text-white/40 leading-relaxed uppercase tracking-widest text-right">
            GEOLOCATION: ENABLED<br/>
            ENCRYPTION: AES-256<br/>
            STATUS: OPERATIONAL
          </p>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 bg-white relative">
        <div className="w-full max-w-[400px] animate-fade-in">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-black">CHARMENDER ZONE</h1>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4">Welcome back</h2>
            <p className="text-on-surface-variant text-lg">Enter your credentials to access the monitoring system.</p>
          </div>

          {/* Form */}
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-zone-critical/10 border-l-4 border-zone-critical text-zone-critical px-4 py-3 animate-slide-up">
                {error}
              </div>
            )}
            
            {/* Email */}
            <div className="space-y-1">
              <label className="label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="uber-input"
                placeholder="name@example.com"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="uber-input"
                placeholder="••••••••••••"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary group"
            >
              <span className="tracking-wide">{loading ? 'SIGNING IN...' : 'SIGN IN'}</span>
              {!loading && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-12 text-center text-on-surface-variant text-sm">
            Don't have an account?
            <Link to="/register" className="text-black font-bold hover:underline ml-2">
              Register
            </Link>
          </p>
        </div>

        {/* Footer Tech Info */}
        <div className="absolute bottom-8 left-0 w-full px-12 lg:px-24 flex justify-between items-center opacity-30 pointer-events-none">
          <span className="mono text-[9px] tracking-[0.3em] uppercase">SECURED CONNECTION</span>
          <span className="mono text-[9px] tracking-[0.3em] uppercase">V1.0.0</span>
        </div>
      </section>
    </main>
  );
};

export default Login;
