import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const ROLE_HOME = {
  participant: '/',
  organizer: '/',
};

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: params.get('role') === 'organizer' ? 'organizer' : 'participant',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required.';
    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(err => { const n = { ...err }; delete n[e.target.name]; return n; });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setServerError('');
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-950">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-primary-600 font-bold">EventMate</span>
          </Link>
          <h1 className="text-2xl font-bold text-dark-50 mt-6 mb-1">Create your account</h1>
          <p className="text-dark-400 text-sm font-semibold">Join thousands of event enthusiasts</p>
        </div>

        <div className="glass-card p-8 bg-dark-900 border border-dark-700">
          {serverError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-5 font-semibold">
              <AlertCircle size={16} className="shrink-0" /> {serverError}
            </div>
          )}

          {/* Role selector */}
          <div className="mb-6">
            <p className="label">I want to...</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ value: 'participant', label: 'Attend Events', desc: 'Discover & register for events' },
                { value: 'organizer', label: 'Host Events', desc: 'Create & manage events' }].map(opt => (
                <button
                  key={opt.value}
                  id={`role-${opt.value}`}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    form.role === opt.value
                      ? 'border-primary-600 bg-primary-600/10'
                      : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                  }`}
                >
                  <p className="font-bold text-dark-50 text-sm">{opt.label}</p>
                  <p className="text-dark-400 text-xs mt-0.5 font-semibold">{opt.desc}</p>
                  {form.role === opt.value && <CheckCircle size={14} className="text-primary-600 mt-2" />}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            <div>
              <label htmlFor="reg-name" className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" className={`input-field pl-10 ${errors.name ? 'border-red-500' : ''}`} />
              </div>
              {errors.name && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`} />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="reg-password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="reg-password" type={showPw ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-12 ${errors.password ? 'border-red-500' : ''}`} />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="reg-confirm" className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input id="reg-confirm" type={showPw ? 'text' : 'password'} name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 font-semibold">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg" id="register-submit">
              Create Account
            </Button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-5 font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-bold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;