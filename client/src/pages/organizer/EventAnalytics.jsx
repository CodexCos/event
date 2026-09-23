import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Eye, Users, Percent } from 'lucide-react';
import Layout from '../../components/Layout';
import StatCard from '../../components/StatCard';
import Spinner from '../../components/Spinner';
import { RegistrationsAreaChart, DailyBarChart } from '../../components/RegistrationChart';
import { getEventById } from '../../services/eventService';
import { getEventAnalytics } from '../../services/analyticsService';

const EventAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [ev, an] = await Promise.all([getEventById(id), getEventAnalytics(id)]);
      setEvent(ev);
      setAnalytics(an);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Layout><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white border border-dark-200 text-dark-600 hover:bg-primary-50 hover:text-primary-700 font-bold transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">Event Analytics</h1>
            {event && <p className="text-dark-400 text-sm mt-0.5 font-semibold">{event.title}</p>}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Registrations" value={analytics.totalRegistrations.toLocaleString()} icon={Users} color="primary" />
          <StatCard label="Total Views" value={analytics.totalViews.toLocaleString()} icon={Eye} color="accent" />
          <StatCard label="Conversion Rate" value={`${analytics.conversionRate}%`} icon={Percent} color="emerald" />
          <StatCard label="Avg. Days to Register" value={analytics.avgDaysBeforeEvent} icon={TrendingUp} color="cyan" subtitle="before event date" />
        </div>

        {/* Registrations over time */}
        <div className="card p-6 bg-white border border-dark-200 shadow-sm">
          <h2 className="section-title mb-2">Cumulative Registrations Over Time</h2>
          <p className="text-dark-400 text-sm mb-6 font-semibold">Registration growth from launch to present</p>
          <RegistrationsAreaChart data={analytics.registrationTimeSeries} />
        </div>

        {/* Registrations by day of week */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6 bg-white border border-dark-200 shadow-sm">
            <h2 className="section-title mb-2">Registrations by Day of Week</h2>
            <p className="text-dark-400 text-sm mb-5 font-semibold">Which days see the most sign-ups</p>
            <DailyBarChart data={analytics.registrationsByDay} dataKey="count" name="Registrations" />
          </div>

          <div className="card p-6 bg-white border border-dark-200 shadow-sm">
            <h2 className="section-title mb-4">Traffic Sources</h2>
            <div className="space-y-4">
              {analytics.topSources.map(src => (
                <div key={src.source}>
                  <div className="flex justify-between text-sm mb-1.5 font-semibold">
                    <span className="text-dark-600">{src.source}</span>
                    <span className="text-dark-100 font-bold">{src.count}%</span>
                  </div>
                  <div className="w-full bg-dark-100 border border-dark-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary-600"
                      style={{ width: `${src.count}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event info */}
        {event && (
          <div className="card p-6 bg-white border border-dark-200 shadow-sm">
            <h2 className="section-title mb-4">Event Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-semibold">
              <div><p className="text-dark-600">Category</p><p className="text-dark-100 font-bold mt-0.5">{event.category}</p></div>
              <div><p className="text-dark-600">Date</p><p className="text-dark-100 font-bold mt-0.5">{new Date(event.date).toLocaleDateString()}</p></div>
              <div><p className="text-dark-600">Capacity</p><p className="text-dark-100 font-bold mt-0.5">{event.capacity}</p></div>
              <div><p className="text-dark-600">Registered</p><p className="text-dark-100 font-bold mt-0.5">{event.registeredCount}</p></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventAnalytics;