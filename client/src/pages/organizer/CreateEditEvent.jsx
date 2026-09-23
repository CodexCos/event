import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag, Image, FileText, Clock, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Spinner from '../../components/Spinner';
import { getEventById, createEvent, updateEvent } from '../../services/eventService';

const CATEGORIES = ['Technology', 'Music', 'Sports', 'Business', 'Art', 'Food'];

const initialForm = {
  title: '', description: '', category: 'Technology',
  date: '', time: '09:00', endTime: '18:00',
  location: '', capacity: '', price: '0',
  imageUrl: '', tags: '', status: 'published',
};

const Field = ({ label, id, error, icon: Icon, children }) => (
  <div>
    <label htmlFor={id} className="label flex items-center gap-1.5">
      {Icon && <Icon size={13} className="text-primary-600" />}
      {label}
    </label>
    {children}
    {error && <p className="text-red-600 text-xs mt-1 font-semibold">{error}</p>}
  </div>
);

const CreateEditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toast = useToast();
  const isEdit = !!id;

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getEventById(id).then(ev => {
        if (ev) setForm({
          title: ev.title,
          description: ev.description,
          category: ev.category,
          date: ev.date,
          time: ev.time || '09:00',
          endTime: ev.endTime || '18:00',
          location: ev.location,
          capacity: String(ev.capacity),
          price: String(ev.price),
          imageUrl: ev.imageUrl || '',
          tags: ev.tags?.join(', ') || '',
          status: ev.status || 'published',
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => { const n = { ...err }; delete n[name]; return n; });
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.date) e.date = 'Date is required.';
    if (!form.location.trim()) e.location = 'Location is required.';
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) < 1) e.capacity = 'Valid capacity is required.';
    if (isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price is required.';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity),
        price: Number(form.price),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        organizerId: currentUser.id,
      };
      if (isEdit) {
        await updateEvent(id, payload);
        toast.success('Event updated!', 'Your changes have been saved.');
      } else {
        await createEvent(payload);
        toast.success('Event created!', 'Your event is now live.');
      }
      navigate('/organizer/events');
    } catch {
      toast.error('Error', 'Failed to save event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-24"><Spinner size="lg" /></div></Layout>;



  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-dark-900 border border-dark-700 text-dark-400 hover:text-primary-600 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
            <p className="text-dark-400 text-sm mt-0.5 font-semibold">{isEdit ? 'Update your event details.' : 'Fill in the details to launch your event.'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" id="event-form">
          {/* Basic Info */}
          <div className="glass-card p-6 space-y-5 bg-dark-900 border border-dark-700">
            <h2 className="section-title flex items-center gap-2"><FileText size={18} className="text-primary-600" /> Basic Information</h2>

            <Field label="Event Title" id="ev-title" error={errors.title} icon={Tag}>
              <input id="ev-title" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. TechSummit 2026" className={`input-field font-semibold ${errors.title ? 'border-red-500' : ''}`} />
            </Field>

            <Field label="Description" id="ev-desc" error={errors.description} icon={FileText}>
              <textarea id="ev-desc" name="description" value={form.description} onChange={handleChange}
                placeholder="Describe your event in detail..."
                rows={5} className={`input-field resize-none font-semibold ${errors.description ? 'border-red-500' : ''}`} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" id="ev-category">
                <select id="ev-category" name="category" value={form.category} onChange={handleChange} className="input-field font-semibold">
                  {CATEGORIES.map(c => <option key={c} value={c} className="text-dark-100 bg-dark-800">{c}</option>)}
                </select>
              </Field>

              <Field label="Event Status" id="ev-status">
                <select id="ev-status" name="status" value={form.status} onChange={handleChange} className="input-field font-semibold">
                  <option value="published" className="text-dark-100 bg-dark-800">Published (Public)</option>
                  <option value="draft" className="text-dark-100 bg-dark-800">Draft (Hidden)</option>
                </select>
              </Field>
            </div>

            <Field label="Tags (comma-separated)" id="ev-tags" icon={Tag}>
              <input id="ev-tags" name="tags" value={form.tags} onChange={handleChange}
                placeholder="e.g. tech, networking, AI" className="input-field font-semibold" />
            </Field>
          </div>

          {/* Date & Location */}
          <div className="glass-card p-6 space-y-5 bg-dark-900 border border-dark-700">
            <h2 className="section-title flex items-center gap-2"><Calendar size={18} className="text-purple-700" /> Date, Time & Location</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Date" id="ev-date" error={errors.date} icon={Calendar}>
                <input id="ev-date" type="date" name="date" value={form.date} onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`input-field font-semibold ${errors.date ? 'border-red-500' : ''}`} />
              </Field>
              <Field label="Start Time" id="ev-time" icon={Clock}>
                <input id="ev-time" type="time" name="time" value={form.time} onChange={handleChange} className="input-field font-semibold" />
              </Field>
              <Field label="End Time" id="ev-endtime" icon={Clock}>
                <input id="ev-endtime" type="time" name="endTime" value={form.endTime} onChange={handleChange} className="input-field font-semibold" />
              </Field>
            </div>

            <Field label="Location / Venue" id="ev-location" error={errors.location} icon={MapPin}>
              <input id="ev-location" name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. San Francisco Convention Center, CA"
                className={`input-field font-semibold ${errors.location ? 'border-red-500' : ''}`} />
            </Field>
          </div>

          {/* Capacity & Price */}
          <div className="glass-card p-6 space-y-5 bg-dark-900 border border-dark-700">
            <h2 className="section-title flex items-center gap-2"><Users size={18} className="text-emerald-700" /> Capacity & Pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Capacity (max attendees)" id="ev-capacity" error={errors.capacity} icon={Users}>
                <input id="ev-capacity" type="number" name="capacity" value={form.capacity} onChange={handleChange}
                  placeholder="e.g. 500" min="1"
                  className={`input-field font-semibold ${errors.capacity ? 'border-red-500' : ''}`} />
              </Field>
              <Field label="Ticket Price (NPR, 0 = Free)" id="ev-price" error={errors.price}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 font-bold">Rs.</span>
                  <input id="ev-price" type="number" name="price" value={form.price} onChange={handleChange}
                    placeholder="0" min="0" step="0.01"
                    className={`input-field pl-10 font-semibold ${errors.price ? 'border-red-500' : ''}`} />
                </div>
              </Field>
            </div>
          </div>

          {/* Image */}
          <div className="glass-card p-6 space-y-5 bg-dark-900 border border-dark-700">
            <h2 className="section-title flex items-center gap-2"><Image size={18} className="text-amber-700" /> Event Image</h2>
            <Field label="Image URL" id="ev-image" icon={Image}>
              <input id="ev-image" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                placeholder="https://... (Unsplash or any image URL)"
                className="input-field font-semibold" />
            </Field>
            {form.imageUrl && (
              <div className="mt-3">
                <p className="text-xs text-dark-400 mb-2 font-semibold">Preview:</p>
                <img src={form.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded-xl border border-dark-700" />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="button" variant="secondary" onClick={() => navigate('/organizer/events')}>Cancel</Button>
            <Button type="submit" loading={saving} icon={Save} id="save-event-btn">
              {isEdit ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEditEvent;