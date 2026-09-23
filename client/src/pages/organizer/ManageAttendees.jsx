import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, CheckCircle, UserMinus, ArrowLeft, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import Badge from '../../components/Badge';
import Spinner from '../../components/Spinner';
import EmptyState from '../../components/EmptyState';
import { getEventById } from '../../services/eventService';
import { getRegistrationsByEvent, markAttended, removeAttendee } from '../../services/registrationService';

const ManageAttendees = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [ev, regs] = await Promise.all([getEventById(id), getRegistrationsByEvent(id)]);
      setEvent(ev);
      setAttendees(regs);
      setFiltered(regs);
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    let result = attendees;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.user?.name?.toLowerCase().includes(q) || r.user?.email?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, attendees]);

  const handleMarkAttended = async (reg) => {
    await markAttended(reg.id);
    setAttendees(prev => prev.map(r => r.id === reg.id ? { ...r, attended: true, status: 'attended' } : r));
    toast.success('Marked as attended', `${reg.user?.name} has been marked as attended.`);
  };

  const handleRemove = async (reg) => {
    await removeAttendee(reg.id);
    setAttendees(prev => prev.filter(r => r.id !== reg.id));
    toast.info('Attendee removed', `${reg.user?.name} has been removed.`);
  };

  if (loading) return <Layout><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>;

  const stats = {
    total: attendees.length,
    confirmed: attendees.filter(r => r.status === 'confirmed').length,
    attended: attendees.filter(r => r.status === 'attended').length,
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-dark-200 text-dark-600 hover:bg-primary-50 hover:text-primary-700 font-bold transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Manage Attendees</h1>
            {event && <p className="text-dark-400 text-sm mt-0.5 font-semibold">{event.title}</p>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center bg-white border border-dark-200 shadow-sm">
            <p className="text-2xl font-extrabold text-dark-50">{stats.total}</p>
            <p className="text-dark-400 text-xs mt-1 font-semibold">Total Registered</p>
          </div>
          <div className="card p-4 text-center bg-white border border-dark-200 shadow-sm">
            <p className="text-2xl font-extrabold text-emerald-700">{stats.confirmed}</p>
            <p className="text-dark-400 text-xs mt-1 font-semibold">Confirmed</p>
          </div>
          <div className="card p-4 text-center bg-white border border-dark-200 shadow-sm">
            <p className="text-2xl font-extrabold text-primary-600">{stats.attended}</p>
            <p className="text-dark-400 text-xs mt-1 font-semibold">Attended</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-5 flex flex-col sm:flex-row gap-4 bg-white border border-dark-200 shadow-sm">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              id="attendee-search"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 font-semibold"
            />
          </div>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-field w-auto font-semibold"
          >
            <option value="all" className="text-dark-100 bg-white">All Status</option>
            <option value="confirmed" className="text-dark-100 bg-white">Confirmed</option>
            <option value="attended" className="text-dark-100 bg-white">Attended</option>
            <option value="cancelled" className="text-dark-100 bg-white">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-hidden bg-white border border-dark-200 shadow-sm">
          {filtered.length === 0 ? (
            <EmptyState icon={Users} title="No attendees found" message="No registrations match your search." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-dark-200">
                  <tr>
                    {['Attendee', 'Email', 'Registered', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-dark-400 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(reg => (
                    <tr key={reg.id} className="border-b border-dark-100 hover:bg-primary-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={reg.user?.name} size="sm" />
                          <p className="font-bold text-dark-100">{reg.user?.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-dark-400 font-semibold">{reg.user?.email}</td>
                      <td className="px-5 py-4 text-dark-400 font-semibold">{reg.registeredAt}</td>
                      <td className="px-5 py-4">
                        <Badge status={reg.status}>
                          {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {reg.status === 'confirmed' && (
                            <Button size="sm" variant="secondary" icon={CheckCircle}
                              onClick={() => handleMarkAttended(reg)}
                              id={`mark-attended-${reg.id}`}
                            >
                              Mark Attended
                            </Button>
                          )}
                          <Button size="sm" variant="danger" icon={UserMinus}
                            onClick={() => handleRemove(reg)}
                            id={`remove-${reg.id}`}
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
    </Layout>
  );
};

export default ManageAttendees;