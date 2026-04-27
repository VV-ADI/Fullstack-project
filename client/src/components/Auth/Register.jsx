import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: strength, text: 'Weak', color: 'bg-zone-critical' };
    if (strength <= 3) return { level: strength, text: 'Medium', color: 'bg-zone-medium' };
    return { level: strength, text: 'Strong', color: 'bg-success' };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, role);
    
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
        {/* Background */}
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
                Stay<br/>informed.
              </p>
              <p className="text-xl text-white/70 font-normal leading-relaxed max-w-md">
                Join the containment monitoring network. Receive real-time alerts when approaching restricted zones.
              </p>
            </div>
          </div>
          
          {/* Features */}
          <div className="space-y-4 max-w-md">
            <div className="border-t border-white/20 pt-4 flex items-start gap-4">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div>
                <span className="mono text-white text-[10px] uppercase tracking-[0.2em] block mb-1">Real-time Tracking</span>
                <span className="text-white/50 text-sm">Live location monitoring with instant zone detection</span>
              </div>
            </div>
            <div className="border-t border-white/20 pt-4 flex items-start gap-4">
              <div className="w-8 h-8 bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <span className="mono text-white text-[10px] uppercase tracking-[0.2em] block mb-1">Proximity Alerts</span>
                <span className="text-white/50 text-sm">200m buffer warning before zone entry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 lg:px-24 bg-white relative overflow-y-auto">
        <div className="w-full max-w-[400px] py-12 animate-fade-in">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-black">CHARMENDER ZONE</h1>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-black mb-4">Create account</h2>
            <p className="text-on-surface-variant text-lg">Register to access the monitoring system.</p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-zone-critical/10 border-l-4 border-zone-critical text-zone-critical px-4 py-3 animate-slide-up">
                {error}
              </div>
            )}
            
            {/* Name */}
            <div className="space-y-1">
              <label className="label" htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="uber-input"
                placeholder="John Doe"
              />
            </div>

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
              {/* Strength Indicator */}
              {password && (
                <div className="pt-2 flex justify-between items-center animate-fade-in">
                  <div className="h-[2px] flex-1 bg-neutral-100 overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                    />
                  </div>
                  <span className="mono text-[9px] text-on-surface-variant uppercase ml-4 tracking-wider">
                    Strength: {passwordStrength.text}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="uber-input"
                placeholder="••••••••••••"
              />
            </div>

            {/* Role */}
            <div className="space-y-3">
              <label className="label">Account Type</label>
              <div className="flex gap-px border border-black">
                <button
                  type="button"
                  onClick={() => setRole('User')}
                  className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    role === 'User' ? 'bg-black text-white' : 'bg-white text-black hover:bg-surface-variant'
                  }`}
                >
                  General User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Admin')}
                  className={`flex-1 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    role === 'Admin' ? 'bg-black text-white' : 'bg-white text-black hover:bg-surface-variant'
                  }`}
                >
                  Administrator
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary group mt-8"
            >
              <span className="tracking-wide">{loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
              {!loading && (
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-on-surface-variant text-sm">
            Already have an account?
            <Link to="/login" className="text-black font-bold hover:underline ml-2">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
