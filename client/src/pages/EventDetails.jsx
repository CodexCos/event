import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Clock, Tag, ArrowLeft, CheckCircle,
  Flame, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Layout from '../components/Layout';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import { getEventById } from '../services/eventService';
import { getUserById } from '../services/userService';
import { isRegistered, registerForEvent, cancelRegistration } from '../services/registrationService';
import { initiateEsewaPayment, submitEsewaForm } from '../services/paymentService';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const ev = await getEventById(id);
      if (!ev) { navigate('/events'); return; }
      setEvent(ev);
      
      const [reg, org] = await Promise.all([
        currentUser ? isRegistered(currentUser.id, id) : Promise.resolve(false),
        getUserById(ev.organizerId)
      ]);
      
      setRegistered(reg);
      setOrganizer(org);
      setLoading(false);
    };
    load();
  }, [id, currentUser?.id, navigate]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      if (event.price > 0) {
        toast.info('Redirecting', 'Preparing eSewa payment gateway...');
        const { esewaUrl, formData } = await initiateEsewaPayment(id);
        submitEsewaForm(esewaUrl, formData);
      } else {
        await registerForEvent(currentUser.id, id);
        setRegistered(true);
        setShowConfirm(false);
        toast.success('Registered!', `You're registered for ${event.title}`);
      }
    } catch (err) {
      toast.error('Registration failed', err.message);
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    setRegistering(true);
    try {
      await cancelRegistration(currentUser.id, id);
      setRegistered(false);
      setShowCancel(false);
      toast.info('Cancelled', 'Your registration has been cancelled.');
    } catch (err) {
      toast.error('Error', err.message);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return (
    <Layout noSidebar><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>
  );

  if (!event) return null;

  const fill = Math.round((event.registeredCount / event.capacity) * 100);
  const isFull = event.registeredCount >= event.capacity;
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const RegistrationWidget = ({ className = '', isStickyMobile = false }) => {
    if (isStickyMobile) {
      return (
        <div className={`fixed bottom-0 left-0 right-0 z-40 bg-dark-900 border-t border-dark-700/80 px-6 py-4 flex items-center justify-between shadow-2xl lg:hidden animate-fade-in ${className}`}>
          <div>
            {event.price === 0 ? (
              <p className="text-2xl font-extrabold text-emerald-700">FREE</p>
            ) : (
              <div>
                <p className="text-2xl font-extrabold text-dark-50">Rs. {event.price}</p>
                <p className="text-dark-400 text-[10px] font-bold">per person</p>
              </div>
            )}
          </div>
          <div className="w-2/3 max-w-[280px]">
            {!currentUser ? (
              <Button
                className="w-full"
                size="md"
                onClick={() => navigate(`/login?redirect=/events/${event.id}`)}
                id="mobile-login-to-register-btn"
              >
                Register
              </Button>
            ) : currentUser.role === 'organizer' || currentUser.role === 'admin' ? (
              <div className="text-center text-xs text-dark-400 font-semibold px-2 py-2 rounded-xl bg-dark-800 border border-dark-700">
                No Booking Access
              </div>
            ) : registered ? (
              <Button size="md" variant="danger" className="w-full" onClick={() => setShowCancel(true)} id="mobile-cancel-reg-btn">
                Cancel
              </Button>
            ) : (
              <Button
                className={`w-full ${event.price > 0 ? 'bg-[#60bb46] hover:bg-[#52a43b] text-white border-none' : ''}`}
                size="md"
                disabled={isFull}
                onClick={() => setShowConfirm(true)}
                id="mobile-register-btn"
              >
                {isFull ? 'Full' : event.price > 0 ? 'Pay via eSewa' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`glass-card p-6 bg-dark-900 border border-dark-700 ${className}`}>
        <div className="text-center mb-5">
          {event.price === 0 ? (
            <div>
              <p className="text-3xl font-extrabold text-emerald-700">FREE</p>
              <p className="text-dark-400 text-xs mt-0.5 font-semibold">No ticket required</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-extrabold text-dark-50">Rs. {event.price}</p>
              <div className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#60bb46]/10 border border-[#60bb46]/30 text-[#60bb46] text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60bb46]" />
                eSewa Payment
              </div>
            </div>
          )}
        </div>

        {!currentUser ? (
          <Button
            className="w-full"
            onClick={() => navigate(`/login?redirect=/events/${event.id}`)}
            id="login-to-register-btn"
          >
            Login to Register
          </Button>
        ) : currentUser.role === 'organizer' || currentUser.role === 'admin' ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-dark-800 border border-dark-700 text-dark-400 justify-center">
            <span className="text-sm font-semibold">
              {currentUser.role === 'organizer' ? 'Organizers cannot register for events' : 'Admins cannot register for events'}
            </span>
          </div>
        ) : registered ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 justify-center">
              <CheckCircle size={18} />
              <span className="font-bold text-sm">You're registered!</span>
            </div>
            <Button variant="danger" className="w-full" onClick={() => setShowCancel(true)} id="cancel-reg-btn">
              Cancel Registration
            </Button>
          </div>
        ) : (
          <Button
            className={`w-full ${event.price > 0 ? 'bg-[#60bb46] hover:bg-[#52a43b] text-white border-none shadow-lg shadow-[#60bb46]/20' : ''}`}
            disabled={isFull}
            onClick={() => setShowConfirm(true)}
            id="register-btn"
          >
            {isFull ? 'Event Full' : event.price > 0 ? 'Pay with eSewa' : 'Register Now'}
          </Button>
        )}

        <p className="text-xs text-dark-400 text-center mt-3 font-semibold">Free cancellation up to 24h before</p>
      </div>
    );
  };

  return (
    <Layout noSidebar>
      <div className="max-w-5xl mx-auto pb-24 lg:pb-0">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-dark-400 hover:text-primary-600 mb-6 transition-colors group font-bold">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to events
        </button>

        {/* Hero Image */}
        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-sm">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Badge category={event.category}>{event.category}</Badge>
            {event.trending && <Badge status="trending"><Flame size={10} /> Trending</Badge>}
            {event.featured && <Badge status="featured"><Star size={10} /> Featured</Badge>}
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight drop-shadow-sm">{event.title}</h1>
            <div className="flex flex-wrap gap-2">
              {event.tags.map(tag => (
                <span key={tag} className="text-xs bg-black/50 text-stone-200 px-2.5 py-0.5 rounded-full font-semibold">#{tag}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 bg-dark-900 border border-dark-700">
              <h2 className="section-title mb-4">About this Event</h2>
              <p className="text-dark-300 leading-relaxed font-medium">{event.description}</p>
            </div>

            {/* Details grid */}
            <div className="glass-card p-6 bg-dark-900 border border-dark-700">
              <h2 className="section-title mb-4">Event Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{
                  icon: Calendar, label: 'Date', value: formattedDate, color: 'text-primary-600',
                }, {
                  icon: Clock, label: 'Time', value: `${event.time} – ${event.endTime || 'TBA'}`, color: 'text-purple-700',
                }, {
                  icon: MapPin, label: 'Location', value: event.location, color: 'text-cyan-700',
                }, {
                  icon: Users, label: 'Capacity', value: `${event.registeredCount} / ${event.capacity} registered`, color: 'text-emerald-700',
                }].map(d => (
                  <div key={d.label} className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-700/50">
                    <d.icon size={18} className={`${d.color} shrink-0 mt-0.5`} />
                    <div>
                      <p className="text-xs text-dark-500 font-bold">{d.label}</p>
                      <p className="text-dark-200 text-sm mt-0.5 font-bold">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Capacity bar */}
              <div className="mt-4 pt-4 border-t border-dark-700/50">
                <div className="flex justify-between text-xs text-dark-400 mb-2 font-semibold">
                  <span>{fill}% capacity filled</span>
                  <span className={isFull ? 'text-red-700 font-bold' : 'text-emerald-700 font-bold'}>
                    {isFull ? 'Sold out' : `${event.capacity - event.registeredCount} spots left`}
                  </span>
                </div>
                <div className="w-full bg-dark-800 border border-dark-700/30 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      fill >= 90 ? 'bg-red-600' : fill >= 70 ? 'bg-amber-600' : 'bg-primary-600'
                    }`}
                    style={{ width: `${Math.min(fill, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Registration Card (Desktop only) */}
            <RegistrationWidget className="hidden lg:block" />

            {/* Organizer */}
            {organizer && (
              <div className="glass-card p-5 bg-dark-900 border border-dark-700">
                <h3 className="text-sm font-bold text-dark-400 mb-3">Organized by</h3>
                <Link to={`/organizers/${organizer.id}`} className="flex items-center gap-3 group/org">
                  <Avatar name={organizer.name} size="md" />
                  <div>
                    <p className="font-bold text-dark-100 text-sm group-hover/org:text-primary-600 transition-colors">{organizer.name}</p>
                    <p className="text-xs text-dark-400 font-semibold">{organizer.company || 'Independent Organizer'}</p>
                  </div>
                </Link>
                {organizer.bio && <p className="text-xs text-dark-400 mt-3 leading-relaxed font-semibold">{organizer.bio}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Registration Bar */}
        <RegistrationWidget isStickyMobile={true} />
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title={event.price > 0 ? "Pay with eSewa" : "Confirm Registration"}>
        <div className="space-y-4">
          <p className="text-dark-300 font-medium">You are about to register for:</p>
          <div className="glass-card p-4 bg-dark-800 border border-dark-700/60 space-y-2">
            <p className="font-bold text-dark-50">{event.title}</p>
            <p className="text-sm text-dark-400 font-semibold">{formattedDate} · {event.time}</p>
            <p className="text-sm text-dark-400 font-semibold">{event.location}</p>
          </div>

          {event.price > 0 && (
            <div className="p-4 rounded-xl bg-[#60bb46]/10 border border-[#60bb46]/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#60bb46]" />
                  <span className="font-extrabold text-[#60bb46] text-sm">eSewa Mobile Wallet</span>
                </div>
                <p className="text-xs text-dark-300 mt-0.5">Secure payment gateway redirection</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-dark-400 font-bold block">Total Amount</span>
                <span className="text-xl font-extrabold text-white">Rs. {event.price}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>Cancel</Button>
            {event.price > 0 ? (
              <button
                disabled={registering}
                onClick={handleRegister}
                id="confirm-esewa-pay-btn"
                className="flex-1 font-bold py-2.5 px-4 rounded-xl bg-[#60bb46] hover:bg-[#52a43b] text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#60bb46]/20 disabled:opacity-50"
              >
                {registering ? <Spinner size="sm" /> : `Pay Rs. ${event.price} with eSewa`}
              </button>
            ) : (
              <Button className="flex-1" loading={registering} onClick={handleRegister} id="confirm-reg-btn">Confirm Registration</Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={showCancel} onClose={() => setShowCancel(false)} title="Cancel Registration">
        <div className="space-y-4">
          <p className="text-dark-300 font-medium font-semibold">Are you sure you want to cancel your registration for <strong className="text-dark-50">{event.title}</strong>?</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCancel(false)}>Keep Registration</Button>
            <Button variant="danger" className="flex-1" loading={registering} onClick={handleCancel} id="confirm-cancel-btn">Yes, Cancel</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default EventDetails;
