import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Flame, Star } from 'lucide-react';
import Badge from './Badge';

const EventCard = ({ event, href }) => {
  const fill = Math.round((event.registeredCount / event.capacity) * 100);
  const isFull = event.registeredCount >= event.capacity;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const CardContent = () => (
    <div className="glass-card-hover overflow-hidden group h-full flex flex-col bg-dark-900 border border-dark-700">
      <div className="relative h-48 overflow-hidden border-b border-dark-700/50">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'; }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge category={event.category}>{event.category}</Badge>
          {event.trending && <Badge status="trending"><Flame size={10} />Trending</Badge>}
          {event.featured && <Badge status="featured"><Star size={10} />Featured</Badge>}
        </div>
        <div className="absolute bottom-3 right-3 z-10">
          {event.price === 0 ? (
            <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">FREE</span>
          ) : (
            <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Rs. {event.price}</span>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-dark-100 text-base mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {event.title}
        </h3>
        <p className="text-dark-400 text-sm line-clamp-2 mb-4 flex-1 font-semibold">{event.description}</p>
        <div className="space-y-2 text-xs text-dark-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-primary-600 shrink-0" />
            <span>{formattedDate} · {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-purple-700 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-dark-700/50">
          <div className="flex items-center justify-between mb-2 font-semibold">
            <div className="flex items-center gap-1 text-xs text-dark-400">
              <Users size={12} />
              <span>{event.registeredCount} / {event.capacity}</span>
            </div>
            <span className={`text-xs font-bold ${isFull ? 'text-red-700' : 'text-emerald-700'}`}>
              {isFull ? 'Full' : `${100 - fill}% left`}
            </span>
          </div>
          <div className="w-full bg-dark-800 border border-dark-700/30 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                fill >= 90 ? 'bg-red-600' : fill >= 70 ? 'bg-amber-600' : 'bg-primary-600'
              }`}
              style={{ width: `${Math.min(fill, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="h-full block"><CardContent /></Link>;
  }
  return <CardContent />;
};

export default EventCard;
