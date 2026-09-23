import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, Bell, CalendarCheck,
  PlusCircle, ShieldCheck, UserCog, ListChecks, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PARTICIPANT_NAV = [
  { to: '/participant/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/participant/registrations', icon: Ticket, label: 'My Registrations' },
  { to: '/participant/notifications', icon: Bell, label: 'Notifications' },
];

const ORGANIZER_NAV = [
  { to: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/organizer/events', icon: CalendarCheck, label: 'My Events' },
  { to: '/organizer/events/create', icon: PlusCircle, label: 'Create Event' },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard', icon: ShieldCheck, label: 'Dashboard' },
  { to: '/admin/users', icon: UserCog, label: 'Manage Users' },
  { to: '/admin/events', icon: ListChecks, label: 'Manage Events' },
];

const NAV_MAP = { participant: PARTICIPANT_NAV, organizer: ORGANIZER_NAV, admin: ADMIN_NAV };

const ROLE_LABELS = {
  participant: { label: 'Participant', color: 'bg-blue-50 border-blue-200 text-[#014baa]' },
  organizer:   { label: 'Organizer',  color: 'bg-purple-50 border-purple-200 text-purple-700' },
  admin:       { label: 'Admin',      color: 'bg-red-50 border-red-200 text-red-700' },
};

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const navItems = NAV_MAP[currentUser.role] || [];
  const roleInfo = ROLE_LABELS[currentUser.role];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#0c0a09]/40 z-20 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-dark-900 border-r border-dark-700
          flex flex-col z-20 transition-transform duration-300
          ${ isOpen ? 'translate-x-0' : '-translate-x-full' } lg:translate-x-0`}
      >
        {/* Role badge */}
        <div className={`m-4 p-3 rounded-xl border ${roleInfo.color}`}>
          <div className="flex items-center gap-2">
            <Zap size={14} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">{roleInfo.label} Portal</span>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to.endsWith('create') ? false : true}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <p className="text-xs text-dark-400 text-center font-medium">EventMate v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
