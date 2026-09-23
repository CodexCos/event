import { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EventGrid from '../components/EventGrid';
import EventCarousel from '../components/EventCarousel';
import { getEvents, getRecommendedEvents } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const SORT_OPTIONS = [
  { value: 'date', label: 'Date (soonest)' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'price-low', label: 'Price (low to high)' },
];

const BrowseEvents = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const loadRecommended = useCallback(async () => {
    setRecLoading(true);
    const rec = await getRecommendedEvents(currentUser?.id || null, currentUser?.interests || []);
    setRecommended(rec);
    setRecLoading(false);
  }, [currentUser]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const data = await getEvents({ search, category, sortBy }, currentUser?.id || null);
    setEvents(data);
    setLoading(false);
  }, [search, category, sortBy, currentUser]);

  useEffect(() => { loadRecommended(); }, [loadRecommended]);
  useEffect(() => { loadEvents(); }, [loadEvents]);

  return (
    <Layout noSidebar>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="page-title">Browse Events</h1>
          <p className="text-dark-400 mt-1 font-semibold">Discover amazing events happening near you and around the world.</p>
        </div>

        {/* Recommended carousel */}
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

        {/* Results */}
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
    </Layout>
  );
};

export default BrowseEvents;
