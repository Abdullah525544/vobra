import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';
import { ADMIN_EMAIL } from '../lib/adminAuth';
import { DATA_MODE } from '../lib/firebase';

export default function AdminLogin() {
  const { signIn, loading } = useAdminAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await signIn(email, password);
      toast.success('Welcome back.');
      const next = loc.state?.from || '/admin';
      navigate(next, { replace: true });
    } catch (e2) {
      setErr(e2?.message || 'Could not sign in.');
    }
  };

  const liveMode = DATA_MODE === 'live';

  return (
    <>
      <Helmet><title>Admin — DELISOGA</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-ink-800 text-cream-100 shadow-soft-md">
              <Lock size={20} />
            </div>
            <h1 className="mt-4 font-display text-3xl text-ink-800">Admin login</h1>
            <p className="mt-2 text-sm text-ink-500">Restricted area — admin access only.</p>
          </div>

          <form onSubmit={submit} className="rounded-2xl border border-ink-100 bg-white p-6 sm:p-7 shadow-soft-sm">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input id="email" type="email" autoComplete="username" required
                       className="input-lg pl-10"
                       value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input id="password" type={show ? 'text' : 'password'} autoComplete="current-password" required
                       className="input-lg pl-10 pr-10"
                       placeholder="••••••••"
                       value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center rounded-full text-ink-400 hover:text-ink-700 transition"
                        aria-label={show ? 'Hide password' : 'Show password'}>
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {err && <p className="error mt-3">{err}</p>}

            <button type="submit" disabled={loading} className="btn-primary-lg w-full mt-5">
              {loading ? 'Signing in…' : (<>Sign in <ArrowRight size={16} /></>)}
            </button>

            <div className="mt-5 p-3.5 rounded-xl bg-cream-100 border border-ink-100 text-[12.5px] text-ink-600">
              <p className="font-semibold text-ink-700 inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-sage-500" />
                {liveMode ? 'Live admin access' : 'Demo admin access'}
              </p>
              <p className="mt-1 leading-relaxed">
                {liveMode
                  ? 'Only the configured admin account can sign in. Passwords are verified by Firebase Authentication.'
                  : 'Demo mode is active. Use the configured email and password to explore the admin area.'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
