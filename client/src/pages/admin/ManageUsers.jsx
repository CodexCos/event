import { useState, useEffect } from 'react';
import { UserCheck, UserX, Search, Users } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import { getUsers, updateUserStatus } from '../../services/userService';

const ROLE_COLORS = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  organizer: 'bg-purple-50 text-purple-700 border-purple-200',
  participant: 'bg-blue-50 text-[#014baa] border-[#014baa]/20',
};

const ManageUsers = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getUsers().then(u => { setUsers(u); setFiltered(u); setLoading(false); });
  }, []);

  useEffect(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    if (roleFilter !== 'all') result = result.filter(u => u.role === roleFilter);
    setFiltered(result);
  }, [search, roleFilter, users]);

  const toggleStatus = async (user) => {
    setUpdating(user.id);
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUserStatus(user.id, newStatus);
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      toast.success(
        newStatus === 'active' ? 'User activated' : 'User deactivated',
        `${user.name}'s account is now ${newStatus}.`
      );
    } catch {
      toast.error('Error', 'Failed to update user status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="page-title">Manage Users</h1>
          <p className="text-dark-400 mt-1 font-semibold">View and manage all platform users.</p>
        </div>

        {/* Filters */}
        <div className="card p-5 flex flex-col sm:flex-row gap-4 bg-white border border-dark-200 shadow-sm">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input id="user-search" type="text" placeholder="Search users by name or email..."
              value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-10 font-semibold" />
          </div>
          <select id="role-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-auto font-semibold">
            <option value="all" className="text-dark-100 bg-white">All Roles</option>
            <option value="participant" className="text-dark-100 bg-white">Participants</option>
            <option value="organizer" className="text-dark-100 bg-white">Organizers</option>
            <option value="admin" className="text-dark-100 bg-white">Admins</option>
          </select>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-2 text-sm font-semibold">
          {['all', 'participant', 'organizer', 'admin'].map(role => {
            const count = role === 'all' ? users.length : users.filter(u => u.role === role).length;
            return (
              <button key={role} onClick={() => setRoleFilter(role)}
                className={`px-4 py-1.5 rounded-full border transition-all ${
                  roleFilter === role
                    ? 'bg-primary-50 text-primary-700 border-primary-200 font-bold'
                    : 'text-dark-600 border-transparent hover:text-primary-700 hover:bg-primary-50 font-bold'
                }`}>
                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)} ({count})
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="card overflow-hidden bg-white border border-dark-200 shadow-sm">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="h-14 shimmer bg-dark-100 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No users found" message="No users match your current filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-dark-200">
                  <tr>
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-dark-400 font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user.id} className="border-b border-dark-100 hover:bg-primary-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="sm" />
                          <p className="font-bold text-dark-100">{user.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-dark-600 font-semibold">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${ROLE_COLORS[user.role]}`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={user.status}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-dark-600 font-semibold">
                        {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        {user.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant={user.status === 'active' ? 'danger' : 'secondary'}
                            icon={user.status === 'active' ? UserX : UserCheck}
                            loading={updating === user.id}
                            onClick={() => toggleStatus(user)}
                            id={`toggle-${user.id}`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </Button>
                        )}
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

export default ManageUsers;