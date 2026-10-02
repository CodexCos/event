import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import { getRegistrationsByUser, cancelRegistration } from '../../services/registrationService';
import { getEventById } from '../../services/eventService';

const TABS = ['Upcoming', 'Past', 'Cancelled'];

const MyRegistrations = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('Upcoming');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const regs = await getRegistrationsByUser(currentUser.id);
      const enriched = await Promise.all(
        regs.map(async reg => {
          const ev = await getEventById(reg.eventId);
          return ev ? { ...reg, event: ev } : null;
        })
      );
      setRegistrations(enriched.filter(Boolean));
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  const today = new Date();
  const filtered = registrations.filter(r => {
    const evDate = new Date(r.event?.date);
    if (tab === 'Upcoming') return r.status === 'confirmed' && evDate >= today;
    if (tab === 'Past') return r.status === 'confirmed' && evDate < today;
    return r.status === 'cancelled';
  });

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelRegistration(currentUser.id, cancelTarget.eventId);
      setRegistrations(prev => prev.map(r => r.id === cancelTarget.id ? { ...r, status: 'cancelled' } : r));
      toast.info('Cancelled', 'Your registration has been cancelled.');
      setCancelTarget(null);
    } catch {
      toast.error('Error', 'Failed to cancel registration.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="page-title">My Registrations</h1>
          <p className="text-dark-400 mt-1 font-semibold">Track all your event registrations.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-dark-700 pb-0">
          {TABS.map(t => (
            <button
              key={t}
              id={`tab-${t.toLowerCase()}`}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm transition-all border-b-2 font-bold ${
                tab === t
                  ? 'text-primary-600 border-primary-600'
                  : 'text-dark-400 border-transparent hover:text-primary-600 hover:border-primary-600/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={`No ${tab.toLowerCase()} registrations`}
            message={tab === 'Upcoming' ? "You don't have any upcoming events. Start browsing!" : `No ${tab.toLowerCase()} events found.`}
            actionLabel={tab === 'Upcoming' ? 'Browse Events' : undefined}
            onAction={tab === 'Upcoming' ? () => navigate('/events') : undefined}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map(reg => (
              <div key={reg.id} className="glass-card p-5 flex flex-col sm:flex-row gap-4 bg-dark-900 border border-dark-700">
                <Link to={`/events/${reg.eventId}`}>
                  <img src={reg.event.imageUrl} alt={reg.event.title}
                    className="w-full sm:w-28 h-24 sm:h-20 rounded-xl object-cover shrink-0 hover:opacity-80 transition-opacity border border-dark-700/50" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <Link to={`/events/${reg.eventId}`}
                        className="font-bold text-dark-100 hover:text-primary-600 transition-colors text-base">
                        {reg.event.title}
                      </Link>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 font-semibold">
                        <span className="flex items-center gap-1 text-xs text-dark-400">
                          <Calendar size={11} /> {new Date(reg.event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-dark-400">
                          <MapPin size={11} /> {reg.event.location.split(',')[0]}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {reg.event.price > 0 && reg.status === 'confirmed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#60bb46]/10 text-[#60bb46] border border-[#60bb46]/30 font-bold text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60bb46]" />
                          Paid Rs. {reg.event.price} (eSewa)
                        </span>
                      )}
                      <Badge status={reg.status}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  {tab === 'Upcoming' && (
                    <div className="mt-3">
                      <Button size="sm" variant="danger" icon={X} onClick={() => setCancelTarget(reg)} id={`cancel-${reg.id}`}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)} title="Cancel Registration">
        <div className="space-y-4">
          <p className="text-dark-300 font-semibold">Are you sure you want to cancel your registration for <strong className="text-dark-50">{cancelTarget?.event?.title}</strong>?</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setCancelTarget(null)}>Keep it</Button>
            <Button variant="danger" className="flex-1" loading={cancelling} onClick={handleCancel} id="confirm-cancel">Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MyRegistrations;