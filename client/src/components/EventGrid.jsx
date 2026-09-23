import EventCard from './EventCard';
import SkeletonCard from './SkeletonCard';
import EmptyState from './EmptyState';
import { Search } from 'lucide-react';

const EventGrid = ({ events, loading, linkPrefix = '/events' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <EmptyState icon={Search} title="No events found" message="Try adjusting your search or filters to discover events." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          href={`${linkPrefix}/${event.id}`}
        />
      ))}
    </div>
  );
};

export default EventGrid;
