import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import EventCard from './EventCard';
import SkeletonCard from './SkeletonCard';

const EventCarousel = ({ events, loading, title = 'Recommended for You', linkPrefix = '/events' }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary-100 text-primary-600">
            <Sparkles size={16} />
          </div>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="p-2 rounded-xl bg-dark-900 border border-dark-700 hover:border-primary-600/50 hover:bg-dark-800 text-dark-100 hover:text-primary-600 transition-all"
            id="carousel-prev"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-2 rounded-xl bg-dark-900 border border-dark-700 hover:border-primary-600/50 hover:bg-dark-800 text-dark-100 hover:text-primary-600 transition-all"
            id="carousel-next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-3 scrollbar-thin"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-72" style={{ scrollSnapAlign: 'start' }}>
                <SkeletonCard />
              </div>
            ))
          : events.map(event => (
              <div key={event.id} className="shrink-0 w-72" style={{ scrollSnapAlign: 'start' }}>
                <EventCard event={event} href={`${linkPrefix}/${event.id}`} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default EventCarousel;
