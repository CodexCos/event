import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, TrendingUp, PlusCircle, ArrowRight, BarChart3, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { getEventsByOrganizer } from '../../services/eventService';
import { getOrganizerStats } from '../../services/analyticsService';

const OrganizerDashboard = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [evs, st] = await Promise.all([
        getEventsByOrganizer(currentUser.id),
        getOrganizerStats(currentUser.id),
      ]);
      setEvents(evs.slice(0, 5));
      setStats(st);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">Organizer Dashboard</h1>
            <p className="text-dark-400 mt-1 font-semibold">Welcome back, {currentUser.name.split(' ')[0]}. Here's your event overview.</p>
          </div>
          <Link to="/organizer/events/create" id="create-event-btn">
            <Button icon={PlusCircle}>Create Event</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Events" value={loading ? '...' : stats?.totalEvents ?? 0} icon={Calendar} color="primary" trend={12} />
          <StatCard label="Total Registrations" value={loading ? '...' : stats?.totalRegistrations ?? 0} icon={Users} color="accent" trend={8} />
          <StatCard label="Upcoming Events" value={loading ? '...' : stats?.upcomingEvents ?? 0} icon={TrendingUp} color="emerald" />
          <StatCard label="Avg. Capacity Fill" value={loading ? '...' : `${stats?.avgCapacityFill ?? 0}%`} icon={BarChart3} color="cyan" />
        </div>

        {/* Recent Events Table */}
        <div className="glass-card p-6 bg-dark-900 border border-dark-700">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Events</h2>
            <Link to="/organizer/events" className="text-primary-600 text-sm hover:text-primary-700 flex items-center gap-1 font-bold">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-14 shimmer bg-dark-800 rounded-xl" />)}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-dark-900">
              <Calendar size={32} className="text-dark-500 mx-auto mb-3" />
              <p className="text-dark-400 mb-4 font-semibold">No events yet. Create your first event!</p>
              <Link to="/organizer/events/create"><Button>Create Event</Button></Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-700">
                    {['Event', 'Date', 'Registrations', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-dark-400 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => {
                    const fill = Math.round((ev.registeredCount / ev.capacity) * 100);
                    return (
                      <tr key={ev.id} className="border-b border-dark-700/50 hover:bg-dark-800/40 transition-colors">
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <img src={ev.imageUrl} alt={ev.title} className="w-10 h-10 rounded-lg object-cover border border-dark-700/30" />
                            <div>
                              <p className="font-bold text-dark-100 text-sm">{ev.title}</p>
                              <Badge category={ev.category} className="mt-0.5">{ev.category}</Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-dark-400 font-semibold">
                          {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-3 py-4">
                          <div>
                            <p className="text-dark-100 text-sm font-bold">{ev.registeredCount}/{ev.capacity}</p>
                            <div className="w-20 bg-dark-800 border border-dark-700/30 rounded-full h-1 mt-1">
                              <div className="h-1 rounded-full bg-primary-600" style={{ width: `${fill}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4">
                          {ev.status === 'draft' ? (
                            <Badge status="draft">Draft</Badge>
                          ) : (
                            <Badge status={ev.registeredCount >= ev.capacity ? 'full' : 'active'}>
                              {ev.registeredCount >= ev.capacity ? 'Full' : 'Active'}
                            </Badge>
                          )}
                        </td>
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/organizer/events/${ev.id}/attendees`} id={`attendees-${ev.id}`}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-500/10 transition-all" title="Manage Attendees">
                              <Users size={14} />
                            </Link>
                            <Link to={`/organizer/events/${ev.id}/analytics`} id={`analytics-${ev.id}`}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-500/10 transition-all" title="Analytics">
                              <BarChart3 size={14} />
                            </Link>
                            <Link to={`/organizer/events/${ev.id}/edit`} id={`edit-${ev.id}`}
                              className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-500/10 transition-all" title="Edit">
                              <Edit2 size={14} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/organizer/events/create', icon: PlusCircle, label: 'Create New Event', desc: 'Launch your next event', color: 'bg-blue-50 border-blue-200 text-[#014baa]' },
            { to: '/organizer/events', icon: Calendar, label: 'My Events', desc: 'Manage all your events', color: 'bg-purple-50 border-purple-200 text-purple-700' },
            { to: '/organizer/events', icon: BarChart3, label: 'Analytics', desc: 'View performance insights', color: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
          ].map(link => (
            <Link key={link.label} to={link.to}
              className={`glass-card-hover p-5 bg-dark-900 border border-dark-700 flex items-center gap-4`}>
              <div className={`p-3 rounded-xl border ${link.color}`}>
                <link.icon size={20} className="shrink-0" />
              </div>
              <div>
                <p className="font-bold text-dark-100 text-sm">{link.label}</p>
                <p className="text-dark-400 text-xs mt-0.5 font-semibold">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OrganizerDashboard;