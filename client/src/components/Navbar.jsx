import { Link } from 'react-router-dom';
import { Bell, LogOut, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const ROLE_HOME = {
  participant: '/',
  organizer: '/',
  admin: '/',
};

const Navbar = ({ onMenuToggle, menuOpen, hasSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center px-4 gap-4 sticky top-0 z-30 shadow-sm">
      {hasSidebar && (
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-primary-600 hover:bg-dark-800"
          id="menu-toggle"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      <Link to={currentUser ? ROLE_HOME[currentUser.role] : '/'} className="flex items-center gap-2 font-bold text-lg">
        
        <span className="text-primary-600 font-bold hidden sm:block">EventMate</span>
      </Link>

      <div className="flex-1" />

      {!currentUser ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/events" className="hidden sm:inline-block text-dark-400 hover:text-primary-600 font-semibold text-sm px-2 sm:px-3 py-2 transition-colors">
            Browse Events
          </Link>
          <Link to="/login" className="btn-ghost text-sm font-semibold">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {currentUser.role === 'participant' && (
            <Link to="/participant/notifications" id="notif-btn"
              className="p-2 rounded-xl text-dark-400 hover:text-primary-600 hover:bg-dark-800 relative transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </Link>
          )}

          <div className="relative">
            <button
              id="profile-menu"
              onClick={() => setProfileOpen(o => !o)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-dark-800 transition-all"
            >
              <Avatar name={currentUser.name} size="sm" />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-dark-100 leading-none">{currentUser.name}</p>
                <p className="text-xs text-dark-400 capitalize mt-0.5">{currentUser.role}</p>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-card shadow-card p-2 z-50">
                <div className="px-3 py-2 border-b border-dark-700 mb-1">
                  <p className="text-sm font-semibold text-dark-100">{currentUser.name}</p>
                  <p className="text-xs text-dark-400">{currentUser.email}</p>
                </div>
                <button
                  id="logout-btn"
                  onClick={() => { logout(); setProfileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
