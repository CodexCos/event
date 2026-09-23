import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Calendar, Users, BarChart3, Star, ArrowRight, Shield, Sparkles, SlidersHorizontal } from 'lucide-react';
import { getEvents, getRecommendedEvents } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EventGrid from '../components/EventGrid';
import EventCarousel from '../components/EventCarousel';

const FEATURES = [
  { icon: Calendar, title: 'Discover Events', desc: 'Browse thousands of events across tech, music, sports, art, and more. Smart recommendations tailored to you.', color: 'text-primary-600', bg: 'bg-blue-50 border-blue-100' },
  { icon: Users, title: 'Easy Registration', desc: 'One-click registration with instant confirmation. Track all your upcoming and past events in one place.', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
  { icon: BarChart3, title: 'Organizer Tools', desc: 'Powerful dashboard for event creation, attendee management, and real-time analytics.', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-100' },
  { icon: Shield, title: 'Admin Control', desc: 'Full platform oversight with user management, content moderation, and platform analytics.', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
];

const STATS = [
  { value: '50K+', label: 'Events Hosted' },
  { value: '2M+', label: 'Happy Attendees' },
  { value: '10K+', label: 'Organizers' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const TESTIMONIALS = [
  { name: 'Gita', role: 'Event Organizer', text: 'EventMate transformed how I manage my tech conferences. The analytics alone saved me 10 hours a week.', rating: 5 },
  { name: 'Bikash', role: 'Festival Attendee', text: 'Finding and registering for events has never been easier. The recommendations are surprisingly spot-on!', rating: 5 },
  { name: 'Sunita', role: 'Corporate Organizer', text: 'The attendee management tools are incredible. I can manage 500+ person events without breaking a sweat.', rating: 5 },
];

const SORT_OPTIONS = [
  { value: 'date', label: 'Date (soonest)' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price (low to high)' },
];

const LandingPage = () => {
  const { currentUser } = useAuth();
  
  // Event state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Recommendations state
  const [recommended, setRecommended] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const ROLE_HOME = {
    participant: '/participant/dashboard',
    organizer: '/organizer/dashboard',
    admin: '/admin/dashboard',
  };

  // Load recommendations
  useEffect(() => {
    const loadRecommended = async () => {
      setRecLoading(true);
      const rec = await getRecommendedEvents(currentUser?.id || null, currentUser?.interests || []);
      setRecommended(rec);
      setRecLoading(false);
    };
    loadRecommended();
  }, [currentUser]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const data = await getEvents({ search, category, sortBy }, currentUser?.id || null);
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, [search, category, sortBy, currentUser]);

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-dark-900 border-b border-dark-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary-600 font-bold">EventMate</span>
          </div>
          <div className="flex items-center gap-2">
            {currentUser ? (
              <Link to={ROLE_HOME[currentUser.role]} className="btn-primary text-xs sm:text-sm">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" id="nav-login" className="btn-ghost text-xs sm:text-sm font-medium">Sign In</Link>
                <Link to="/register" id="nav-register" className="btn-primary text-xs sm:text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-dark-50 mb-6 leading-tight">
            Your Events,{' '}
            <span className="text-primary-600 font-extrabold">Effortlessly</span>{' '}
            Managed
          </h1>
          <p className="text-base sm:text-xl text-dark-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover events you'll love, register in seconds, or create and manage your own events with powerful organizer tools — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#discovery-hub" className="btn-primary text-base inline-flex items-center gap-2">
              Browse Events <ArrowRight size={18} />
            </a>
            {!currentUser && (
              <Link to="/register" id="hero-cta-secondary" className="btn-secondary text-base">
                Create Free Account
              </Link>
            )}
          </div>
          <p className="mt-4 text-dark-400 text-sm font-medium">No credit card required · Free to join as a participant</p>
        </div>
      </section>

      {/* Interactive Discovery Hub */}
      <section id="discovery-hub" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20 border-t border-dark-700">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-dark-50">Discover What's Happening</h2>
            <p className="text-dark-400 mt-1 font-semibold">Search and filter active events happening near you.</p>
          </div>

          {/* Recommendations carousel */}
          <EventCarousel events={recommended} loading={recLoading} title="Recommended for You" />

          {/* Search + Filters */}
          <div className="glass-card p-5 space-y-4 bg-dark-900 border border-dark-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <SearchBar
                placeholder="Search events, locations, tags..."
                onSearch={setSearch}
                className="flex-1"
              />
              <div className="flex items-center gap-2 shrink-0">
                <SlidersHorizontal size={16} className="text-dark-400" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input-field py-2 w-auto font-semibold"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="text-dark-100 bg-white">{o.label}</option>)}
                </select>
              </div>
            </div>
            <FilterBar activeCategory={category} onCategoryChange={setCategory} />
          </div>

          {/* Results Grid */}
          <div>
            {!loading && (
              <p className="text-dark-400 text-sm mb-4 font-semibold">
                Showing <span className="text-dark-100 font-bold">{events.length}</span> events
                {category !== 'All' && <> in <span className="text-primary-600 font-bold">{category}</span></>}
                {search && <> for <span className="text-primary-600 font-bold">"{search}"</span></>}
              </p>
            )}
            <EventGrid events={events} loading={loading} linkPrefix="/events" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-dark-700 bg-dark-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-extrabold text-primary-600 mb-1">{stat.value}</p>
                <p className="text-dark-400 text-sm font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-50 mb-4">Everything you need,<br /><span className="text-primary-600 font-bold">in one place</span></h2>
            <p className="text-dark-400 text-lg max-w-xl mx-auto font-medium">Whether you're attending, organizing, or administrating — EventMate has the tools built for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card-hover p-8 bg-dark-900">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${f.bg} ${f.color}`}>
                  <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-dark-50 mb-3">{f.title}</h3>
                <p className="text-dark-400 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-dark-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-dark-50 mb-4">Loved by <span className="text-primary-600 font-bold">thousands</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="glass-card p-6 bg-dark-900 hover:-translate-y-0.5 transition-transform duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-dark-200 text-sm leading-relaxed mb-5 font-medium">"{t.text}"</p>
                <div>
                  <p className="font-bold text-dark-100 text-sm">{t.name}</p>
                  <p className="text-dark-400 text-xs font-semibold">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 bg-dark-900">
            <h2 className="text-4xl font-bold text-dark-50 mb-4">Ready to get started?</h2>
            <p className="text-dark-400 mb-8 font-medium">Join 2 million people already using EventMate to discover and manage amazing events.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=participant" id="cta-participant" className="btn-primary text-base">
                Join as Participant
              </Link>
              <Link to="/register?role=organizer" id="cta-organizer" className="btn-secondary text-base">
                Start as Organizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 bg-dark-900 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-primary-600 font-bold">EventMate</span>
          </div>
          <p className="text-dark-400 text-sm font-semibold">© 2026 EventMate. Built with ❤️ for event lovers.</p>
          <div className="flex gap-4 text-dark-400 text-sm font-semibold">
            <Link to="/login" className="hover:text-primary-600 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-primary-600 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;