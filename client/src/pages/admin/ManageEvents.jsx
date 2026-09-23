import { useState, useEffect } from 'react';
import { Trash2, Search, Calendar } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import EmptyState from '../../components/EmptyState';
import { getEvents, deleteEvent } from '../../services/eventService';
import { getUserById } from '../../services/userService';

const ManageEvents = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const evs = await getEvents();
      // Enrich with organizer name
      const enriched = await Promise.all(evs.map(async ev => {
        const org = await getUserById(ev.organizerId);
        return { ...ev, organizerName: org?.name || 'Unknown' };
      }));
      setEvents(enriched);
      setFiltered(enriched);
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    let result = events;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.organizerName.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') result = result.filter(e => e.category === categoryFilter);
    setFiltered(result);
  }, [search, categoryFilter, events]);

  const CATEGORIES = ['all', 'Technology', 'Music', 'Sports', 'Business', 'Art', 'Food'];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEvent(deleteTarget.id);
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Event removed', `"${deleteTarget.title}" has been deleted.`);
      setDeleteTarget(null);
    } catch {
      toast.error('Error', 'Failed to remove event.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="page-title">Manage Events</h1>
          <p className="text-dark-400 mt-1 font-semibold">View and moderate all events on the platform.</p>
        </div>

        {/* Filters */}
        <div className="card p-5 flex flex-col sm:flex-row gap-4 bg-white border border-dark-200 shadow-sm">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input id="event-admin-search" type="text" placeholder="Search by title or organizer..."
              value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 font-semibold" />
          </div>
          <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input-field w-auto font-semibold">
            {CATEGORIES.map(c => <option key={c} value={c} className="text-dark-100 bg-white">{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
        </div>

        <p className="text-dark-400 text-sm font-semibold">
          Showing <span className="text-dark-100 font-bold">{filtered.length}</span> of {events.length} events
        </p>

        {/* Table */}
        <div className="card overflow-hidden bg-white border border-dark-200 shadow-sm">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 shimmer bg-dark-100 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Calendar} title="No events found" message="No events match your current filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-dark-200">
                  <tr>
                    {['Event', 'Organizer', 'Category', 'Date', 'Registrations', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-dark-400 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ev => (
                    <tr key={ev.id} className="border-b border-dark-100 hover:bg-primary-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={ev.imageUrl} alt={ev.title}
                            className="w-12 h-10 rounded-lg object-cover shrink-0 border border-dark-200"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'; }} />
                          <div>
                            <p className="font-bold text-dark-100 text-sm line-clamp-1">{ev.title}</p>
                            <p className="text-xs text-dark-500 mt-0.5 font-bold">{ev.location.split(',')[0]}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-dark-600 font-semibold">{ev.organizerName}</td>
                      <td className="px-5 py-4">
                        <Badge category={ev.category}>{ev.category}</Badge>
                      </td>
                      <td className="px-5 py-4 text-dark-400 font-semibold">
                        {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-dark-100 font-bold">{ev.registeredCount}</span>
                        <span className="text-dark-500 font-bold">/{ev.capacity}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm" variant="danger" icon={Trash2}
                            onClick={() => setDeleteTarget(ev)}
                            id={`admin-delete-${ev.id}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Remove Event">
        <div className="space-y-4">
          <p className="text-dark-600 font-semibold">Are you sure you want to permanently remove <strong className="text-dark-100">{deleteTarget?.title}</strong> from the platform?</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" className="flex-1" loading={deleting} onClick={handleDelete} id="confirm-admin-delete">Remove Event</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default ManageEvents;