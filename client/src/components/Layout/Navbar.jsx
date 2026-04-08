import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!currentUser) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-black flex justify-between items-center h-16 px-6">
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight text-black uppercase hidden sm:block">SENTINEL LENS</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              isActive('/') 
                ? 'text-black border-b-2 border-black' 
                : 'text-on-surface-variant hover:text-black'
            }`}
          >
            Map
          </Link>
          <Link
            to="/alerts"
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              isActive('/alerts') 
                ? 'text-black border-b-2 border-black' 
                : 'text-on-surface-variant hover:text-black'
            }`}
          >
            Alerts
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className={`px-4 py-2 text-sm font-bold transition-colors ${
                isActive('/admin') 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-on-surface-variant hover:text-black'
              }`}
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-outline">
          <div className="text-right">
            <p className="text-sm font-bold text-black leading-none">{currentUser.name}</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
              {currentUser.role}
            </p>
          </div>
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 text-on-surface-variant hover:text-black transition-colors"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-black flex justify-around items-center z-50">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-black' : 'text-on-surface-variant'}`}
        >
          <svg className="w-5 h-5" fill={isActive('/') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/') ? 0 : 2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Map</span>
        </Link>
        <Link
          to="/alerts"
          className={`flex flex-col items-center gap-1 ${isActive('/alerts') ? 'text-black' : 'text-on-surface-variant'}`}
        >
          <svg className="w-5 h-5" fill={isActive('/alerts') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/alerts') ? 0 : 2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-bold uppercase">Alerts</span>
        </Link>
        {isAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-1 ${isActive('/admin') ? 'text-black' : 'text-on-surface-variant'}`}
          >
            <svg className="w-5 h-5" fill={isActive('/admin') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive('/admin') ? 0 : 2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[10px] font-bold uppercase">Admin</span>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
