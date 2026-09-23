import { useState, useEffect } from 'react';
import { Users, Calendar, Ticket, TrendingUp, Activity, Shield } from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import CategoryPieChart from '../../components/CategoryPieChart';
import { MonthlyLineChart } from '../../components/RegistrationChart';
import { getAdminStats } from '../../services/analyticsService';



import UserClustersWidget from '../../components/UserClustersWidget';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
            <Shield size={22} className="text-red-700" />
          </div>
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="text-dark-400 text-sm mt-0.5 font-semibold">Platform-wide overview and management.</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Users" value={loading ? '...' : stats?.totalUsers ?? 0} icon={Users} color="primary" trend={15} />
          <StatCard label="Total Events" value={loading ? '...' : stats?.totalEvents ?? 0} icon={Calendar} color="accent" trend={22} />
          <StatCard label="Registrations" value={loading ? '...' : stats?.totalRegistrations ?? 0} icon={Ticket} color="emerald" trend={18} />
          <StatCard label="Active Events" value={loading ? '...' : stats?.activeEvents ?? 0} icon={TrendingUp} color="cyan" />
        </div>

        {/* K-Means User Clusters ML Widget */}
        <UserClustersWidget />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="glass-card p-6 bg-dark-900 border border-dark-700">
            <h2 className="section-title mb-1">Platform Growth</h2>
            <p className="text-dark-400 text-sm mb-5 font-semibold">Monthly registrations & events</p>
            {loading ? <div className="h-48 shimmer bg-dark-800 rounded-xl" /> : <MonthlyLineChart data={stats.monthlyStats} />}
          </div>

          {/* Category Breakdown */}
          <div className="glass-card p-6 bg-dark-900 border border-dark-700">
            <h2 className="section-title mb-1">Events by Category</h2>
            <p className="text-dark-400 text-sm mb-5 font-semibold">Distribution across event types</p>
            {loading ? <div className="h-48 shimmer bg-dark-800 rounded-xl" /> : <CategoryPieChart data={stats.categoryBreakdown} />}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue estimate */}
          <div className="glass-card p-6 bg-dark-900 border border-dark-700">
            <h2 className="section-title mb-4">Revenue Estimate</h2>
            <p className="text-4xl font-extrabold text-[#014baa] mb-1">
              {loading ? '...' : `Rs. ${(stats?.revenueEstimate / 1000).toFixed(0)}K`}
            </p>
            <p className="text-dark-400 text-sm font-semibold">Estimated from registered ticket prices</p>
            <div className="mt-4 flex gap-4 text-sm font-semibold">
              <div><p className="text-dark-400">Organizers</p><p className="text-dark-100 font-bold">{loading ? '...' : stats?.totalOrganizers}</p></div>
              <div><p className="text-dark-400">Participants</p><p className="text-dark-100 font-bold">{loading ? '...' : stats?.totalParticipants}</p></div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-card p-6 bg-dark-900 border border-dark-700">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={18} className="text-primary-600" />
              <h2 className="section-title">Recent Activity</h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-10 shimmer bg-dark-800 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-800/60 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark-200 truncate font-semibold">{item.message}</p>
                    </div>
                    <span className="text-xs text-dark-500 shrink-0 font-semibold">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;