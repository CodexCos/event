import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit2, Trash2, Users, BarChart3, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import SearchBar from '../../components/SearchBar';
import FilterBar from '../../components/FilterBar';
import { getEventsByOrganizer, deleteEvent } from '../../services/eventService';

const MyEvents = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getEventsByOrganizer(currentUser.id);
      setEvents(data);
      setFiltered(data);
      setLoading(false);
    };
    load();
  }, [currentUser.id]);

  useEffect(() => {
    let result = events;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    if (category !== 'All') result = result.filter(e => e.category === category);
    setFiltered(result);
  }, [search, category, events]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(deleteTarget.id);
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Event deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Error', 'Failed to delete event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="page-title">My Events</h1>
            <p className="text-dark-400 mt-1 font-semibold">Manage and track all your created events.</p>
          </div>
          <Link to="/organizer/events/create" id="create-new-event">
            <Button icon={PlusCircle}>Create Event</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="glass-card p-5 space-y-4 bg-dark-900 border border-dark-700">
          <SearchBar placeholder="Search your events..." onSearch={setSearch} />
          <FilterBar activeCategory={category} onCategoryChange={setCategory} />
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 shimmer bg-dark-800 rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events found"
            message={events.length === 0 ? "You haven't created any events yet." : 'No events match your filters.'}
            actionLabel={events.length === 0 ? 'Create Your First Event' : undefined}
            onAction={events.length === 0 ? () => window.location.href = '/organizer/events/create' : undefined}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map(ev => {
              const fill = Math.round((ev.registeredCount / ev.capacity) * 100);
              const isFull = ev.registeredCount >= ev.capacity;
              return (
                <div key={ev.id} className="glass-card p-5 flex flex-col sm:flex-row gap-4 bg-dark-900 border border-dark-700">
                  <img src={ev.imageUrl} alt={ev.title}
                    className="w-full sm:w-36 h-24 rounded-xl object-cover shrink-0 border border-dark-700/50" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-dark-100 text-lg leading-tight">{ev.title}</h3>
                          <Badge category={ev.category}>{ev.category}</Badge>
                          <Badge status={ev.status === 'draft' ? 'draft' : 'active'}>
                            {ev.status === 'draft' ? 'Draft' : 'Published'}
                          </Badge>
                          {isFull && <Badge status="full">Full</Badge>}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-dark-400 font-semibold">
                          <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>{ev.location.split(',')[0]}</span>
                          <span>{ev.registeredCount}/{ev.capacity} registered</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link to={`/organizer/events/${ev.id}/attendees`} id={`view-attendees-${ev.id}`}>
                          <Button size="sm" variant="secondary" icon={Users}><span className="hidden sm:inline">Attendees</span></Button>
                        </Link>
                        <Link to={`/organizer/events/${ev.id}/analytics`} id={`view-analytics-${ev.id}`}>
                          <Button size="sm" variant="secondary" icon={BarChart3}><span className="hidden sm:inline">Analytics</span></Button>
                        </Link>
                        <Link to={`/organizer/events/${ev.id}/edit`} id={`edit-event-${ev.id}`}>
                          <Button size="sm" variant="ghost" icon={Edit2} />
                        </Link>
                        <Button size="sm" variant="danger" icon={Trash2}
                          onClick={() => setDeleteTarget(ev)} id={`delete-event-${ev.id}`} />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-dark-400 mb-1 font-semibold">
                        <span>Registration fill</span>
                        <span>{fill}%</span>
                      </div>
                      <div className="w-full bg-dark-800 border border-dark-700/30 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${fill}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Event">
        <div className="space-y-4">
          <p className="text-dark-300 font-semibold">Are you sure you want to delete <strong className="text-dark-50">{deleteTarget?.title}</strong>? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete} id="confirm-delete">Delete Event</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default MyEvents;