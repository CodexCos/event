import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const ROLE_HOME = {
  participant: '/',
  organizer: '/',
  admin: '/',
};

const DEMO_ACCOUNTS = [
  { label: 'Participant', email: 'laxmi@eventmate.com', password: 'participant123', color: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-[#014baa]' },
  { label: 'Organizer', email: 'shyam@eventpro.com', password: 'organizer123', color: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700' },
  { label: 'Admin', email: 'rajesh@eventmate.com', password: 'admin123', color: 'bg-red-50 border-red-200 hover:bg-red-100 text-red-700' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = location.state?.from?.pathname || redirectParam;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email) { setError('Email is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(from || ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (account) => {
    setForm({ email: account.email, password: account.password });
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-950">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <div className="w-11 h-11 rounded-2xl bg-primary-600 flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-primary-600 font-bold">EventMate</span>
          </Link>
          <h1 className="text-2xl font-bold text-dark-50 mt-6 mb-1">Welcome back</h1>
          <p className="text-dark-400 text-sm font-semibold">Sign in to your account to continue</p>
        </div>

        {/* Demo accounts */}
        <div className="glass-card p-4 mb-5 bg-dark-900 border border-dark-700">
          <p className="text-xs text-dark-400 font-bold mb-3 text-center">Quick Demo — click to auto-fill</p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.label}
                id={`demo-${acc.label.toLowerCase()}`}
                type="button"
                onClick={() => fillDemo(acc)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all hover:-translate-y-0.5 ${acc.color}`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="glass-card p-8 bg-dark-900 border border-dark-700">
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-fade-in">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-12"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-primary-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg" id="login-submit">
              Sign In
            </Button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6 font-semibold">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-bold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;