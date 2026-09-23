import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Bell, Clock, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import Badge from '../../components/Badge';
import { getRegistrationsByUser } from '../../services/registrationService';
import { getEventById } from '../../services/eventService';
import { getNotifications } from '../../services/notificationService';

import UserPersonaBadge from '../../components/UserPersonaBadge';
import RecommendedEvents from '../../components/RecommendedEvents';

const ParticipantDashboard = () => {
  const { currentUser } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const regs = await getRegistrationsByUser(currentUser.id);

        // Enrich confirmed registrations with event details
        const enriched = await Promise.all(
          regs
            .filter(r => r.status === 'confirmed')
            .map(async reg => {
              const ev = await getEventById(reg.eventId);
              return ev ? { ...ev, registrationId: reg.id, registeredAt: reg.registeredAt } : null;
            })
        );

        setRegistrations(enriched.filter(Boolean));

        const notifs = await getNotifications();
        setNotifications(notifs);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Hey, {currentUser.name.split(' ')[0]}</h1>
            <p className="text-dark-400 mt-1 font-semibold">Your registrations and notifications.</p>
          </div>
          <UserPersonaBadge userId={currentUser.id} />
        </div>

        {/* Quick summary pills */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-sm font-semibold text-dark-200">
            <Ticket size={14} className="text-primary-600" />
            {loading ? '…' : registrations.length} Registered Events
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-700 text-sm font-semibold text-dark-200">
            <Bell size={14} className={unreadCount > 0 ? 'text-amber-500' : 'text-dark-400'} />
            {loading ? '…' : unreadCount} Unread Notifications
          </div>
        </div>

        {/* ─── AI Decision Tree Recommendations ─── */}
        <RecommendedEvents userId={currentUser.id} />

        {/* ─── My Registrations ─── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title flex items-center gap-2">
              <Ticket size={18} className="text-primary-600" /> My Registrations
            </h2>
            <Link to="/participant/registrations" className="text-primary-600 text-sm hover:text-primary-500 flex items-center gap-1 font-bold">
              See all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 shimmer bg-dark-800 rounded-xl" />)}
            </div>
          ) : registrations.length === 0 ? (
            <div className="glass-card p-10 text-center bg-dark-900">
              <Calendar size={36} className="text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 font-semibold">You haven't registered for any events yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {registrations.map(ev => (
                <Link key={ev.registrationId} to={`/events/${ev.id}`}
                  className="glass-card-hover p-4 flex items-center gap-4 group block bg-dark-900">
                  <img src={ev.imageUrl} alt={ev.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-dark-100 truncate group-hover:text-primary-600 transition-colors">{ev.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-dark-400 font-semibold">
                        <Clock size={11} />
                        {new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-dark-400 font-semibold">
                        <MapPin size={11} /> {ev.location?.split(',')[0]}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge category={ev.category}>{ev.category}</Badge>
                    <span className="flex items-center gap-1 text-xs text-emerald-500 font-bold">
                      <CheckCircle2 size={11} /> Registered
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ─── Notifications ─── */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title flex items-center gap-2">
              <Bell size={18} className="text-amber-500" /> Notifications
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </h2>
            <Link to="/participant/notifications" className="text-primary-600 text-sm hover:text-primary-500 flex items-center gap-1 font-bold">
              See all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 shimmer bg-dark-800 rounded-xl" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="glass-card p-8 text-center bg-dark-900">
              <Bell size={32} className="text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 font-semibold">No notifications yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 6).map(n => (
                <div key={n.id}
                  className={`glass-card p-4 flex items-start gap-3 bg-dark-900 border-l-4 transition-all
                    ${!n.read ? 'border-primary-600' : 'border-dark-700'}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.read ? 'bg-primary-600' : 'bg-dark-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${!n.read ? 'text-dark-100' : 'text-dark-300'}`}>{n.title}</p>
                    <p className="text-dark-400 text-xs mt-0.5 font-semibold line-clamp-2">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="shrink-0 text-xs font-bold text-primary-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </Layout>
  );
};

export default ParticipantDashboard;