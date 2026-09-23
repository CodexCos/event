import { apiFetch } from '../utils/api';

const generateRegistrationTimeSeries = (total, days = 30) => {
  const data = [];
  let cumulative = 0;
  const baseDate = new Date('2026-06-01');
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const daily = Math.floor(Math.random() * (total / days) * 2);
    cumulative = Math.min(cumulative + daily, total);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      registrations: daily,
      cumulative,
    });
  }
  return data;
};

export const getEventAnalytics = async (eventId) => {
  try {
    const event = await apiFetch(`/api/events/${eventId}`);
    const regCount = event.registeredCount || 0;
    return {
      totalRegistrations: regCount,
      totalViews: regCount * 4 + 120,
      conversionRate: regCount > 0 ? ((regCount / (regCount * 4 + 120)) * 100).toFixed(1) : 0,
      avgDaysBeforeEvent: 12,
      registrationTimeSeries: generateRegistrationTimeSeries(regCount),
      viewsTimeSeries: generateRegistrationTimeSeries(regCount * 4).map(d => ({ ...d, views: d.registrations * 3 + 2 })),
      topSources: [
        { source: 'Direct', count: Math.round(regCount * 0.45) },
        { source: 'Social Media', count: Math.round(regCount * 0.30) },
        { source: 'Email', count: Math.round(regCount * 0.15) },
        { source: 'Search', count: Math.round(regCount * 0.10) },
      ],
      registrationsByDay: [
        { day: 'Mon', count: Math.round(regCount * 0.1) }, 
        { day: 'Tue', count: Math.round(regCount * 0.15) }, 
        { day: 'Wed', count: Math.round(regCount * 0.18) },
        { day: 'Thu', count: Math.round(regCount * 0.12) }, 
        { day: 'Fri', count: Math.round(regCount * 0.22) }, 
        { day: 'Sat', count: Math.round(regCount * 0.15) },
        { day: 'Sun', count: Math.round(regCount * 0.08) },
      ],
    };
  } catch {
    return {
      totalRegistrations: 0,
      totalViews: 0,
      conversionRate: 0,
      avgDaysBeforeEvent: 0,
      registrationTimeSeries: [],
      viewsTimeSeries: [],
      topSources: [],
      registrationsByDay: [],
    };
  }
};

export const getAdminStats = async () => {
  const stats = await apiFetch('/api/analytics/admin');
  return {
    ...stats,
    totalOrganizers: stats.usersByRole?.find(r => r.role === 'organizer')?.count || 0,
    totalParticipants: stats.usersByRole?.find(r => r.role === 'participant')?.count || 0,
    activeEvents: stats.totalEvents,
    revenueEstimate: stats.totalRegistrations * 1250,
    categoryBreakdown: stats.eventsByCategory?.map(c => {
      const colors = {
        Technology: '#014baa', Music: '#7c3aed', Sports: '#0891b2',
        Business: '#059669', Art: '#d97706', Food: '#e11d48'
      };
      return {
        category: c.category,
        count: Number(c.count),
        color: colors[c.category] || '#78716c'
      };
    }) || [],
    recentActivity: [
      { id: 1, type: 'registration', message: 'Laxmi registered for TechSummit 2026', time: '2 min ago' },
      { id: 2, type: 'registration', message: 'Nita registered for TechSummit 2026', time: '15 min ago' },
      { id: 3, type: 'registration', message: 'Krishna registered for Urban Marathon 2026', time: '32 min ago' },
      { id: 4, type: 'user_joined', message: 'New organizer Gita joined the platform', time: '1 hr ago' },
    ],
    monthlyStats: [
      { month: 'Jan', registrations: 120, events: 8 },
      { month: 'Feb', registrations: 180, events: 10 },
      { month: 'Mar', registrations: 240, events: 14 },
      { month: 'Apr', registrations: 310, events: 16 },
      { month: 'May', registrations: 420, events: 18 },
      { month: 'Jun', registrations: stats.totalRegistrations, events: stats.totalEvents },
    ],
  };
};

export const getOrganizerStats = async (organizerId) => {
  const stats = await apiFetch(`/api/analytics/organizer/${organizerId}`);
  return {
    totalEvents: stats.totalEvents,
    totalRegistrations: stats.totalRegistrations,
    upcomingEvents: stats.upcomingEvents,
    avgCapacityFill: stats.totalEvents > 0 
      ? Math.round(stats.events.reduce((acc, ev) => acc + (ev.registeredCount / ev.capacity), 0) * 100 / stats.totalEvents)
      : 0
  };
};
