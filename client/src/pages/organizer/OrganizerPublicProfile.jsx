import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Calendar } from 'lucide-react';
import Layout from '../../components/Layout';
import Avatar from '../../components/Avatar';
import EventGrid from '../../components/EventGrid';
import Spinner from '../../components/Spinner';
import { getUserById } from '../../services/userService';
import { getEventsByOrganizer } from '../../services/eventService';

const OrganizerPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const org = await getUserById(id);
        if (!org || org.role !== 'organizer') {
          navigate('/events');
          return;
        }
        setOrganizer(org);
        const evs = await getEventsByOrganizer(id);
        // Only show published events to the public
        setEvents(evs.filter(e => e.status !== 'draft'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) {
    return (
      <Layout noSidebar>
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!organizer) return null;

  return (
    <Layout noSidebar>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-600 transition-colors group font-bold">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        {/* Profile Card */}
        <div className="glass-card p-8 bg-dark-900 border border-dark-700 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
          <Avatar name={organizer.name} size="xl" />
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="page-title">{organizer.name}</h1>
              <p className="text-primary-600 font-bold text-sm mt-1 uppercase tracking-wider">Event Organizer</p>
            </div>
            
            {organizer.bio && (
              <p className="text-dark-300 leading-relaxed max-w-2xl font-medium">{organizer.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-dark-400 font-semibold pt-2">
              {organizer.company && (
                <span className="flex items-center gap-1.5">
                  <Building size={16} className="text-primary-600" />
                  {organizer.company}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Mail size={16} className="text-purple-700" />
                {organizer.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-emerald-700" />
                Joined {new Date(organizer.joinedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          <h2 className="section-title">Events Hosted by {organizer.name.split(' ')[0]}</h2>
          <EventGrid events={events} loading={loading} linkPrefix="/events" />
        </div>
      </div>
    </Layout>
  );
};

export default OrganizerPublicProfile;
