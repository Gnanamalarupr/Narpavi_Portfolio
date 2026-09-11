import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const googleButton = useRef(null); const { login, register, loginWithGoogle } = useAuth(); const navigate = useNavigate();
  const redirect = (user) => navigate(user.role === 'admin' ? '/admin' : '/');
  useEffect(() => {
    if (mode !== 'login' || !googleClientId || !googleButton.current) return undefined;
    const render = () => { if (window.google?.accounts?.id && googleButton.current) { window.google.accounts.id.initialize({ client_id: googleClientId, callback: async ({ credential }) => { setLoading(true); setError(''); try { redirect(await loginWithGoogle(credential)); } catch (error) { setError(error.response?.data?.message || 'Google sign-in failed.'); } finally { setLoading(false); } } }); window.google.accounts.id.renderButton(googleButton.current, { theme: 'outline', size: 'large', width: 360 }); } };
    if (window.google?.accounts?.id) render();
    const timer = window.setInterval(() => { if (window.google?.accounts?.id) { render(); window.clearInterval(timer); } }, 200);
    return () => { window.clearInterval(timer); };
  }, [mode]);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); try { const user = mode === 'login' ? await login({ email: form.email, password: form.password }) : await register(form); redirect(user); } catch (error) { setError(error.response?.data?.message || 'Unable to continue.'); } finally { setLoading(false); } };
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section grid min-h-[65vh] place-items-center"><form onSubmit={submit} className="card w-full max-w-md p-8"><p className="eyebrow">Narpavi account</p><h1 className="display mt-3 text-4xl">{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h1><p className="mt-3 text-sm leading-6 text-[#786869]">{mode === 'login' ? 'Sign in to manage bookings, reviews, and your customer account.' : 'Create a customer account to send enquiries and share reviews.'}</p>{mode === 'register' && <input required minLength="2" className="field mt-7" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />}<input required type="email" className={`field ${mode === 'login' ? 'mt-7' : 'mt-3'}`} placeholder="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /><input required minLength="8" type="password" className="field mt-3" placeholder="Password (at least 8 characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><button disabled={loading} className="btn-primary mt-5 w-full">{loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>{error && <p className="mt-3 text-center text-sm text-rose">{error}</p>}{mode === 'login' ? <><div className="my-6 flex items-center gap-3 text-xs text-[#786869]"><span className="h-px flex-1 bg-[#eaded8]" />or<span className="h-px flex-1 bg-[#eaded8]" /></div>{googleClientId ? <div ref={googleButton} className="flex justify-center" /> : <p className="rounded-xl bg-blush/60 p-3 text-center text-xs text-[#786869]">Google sign-in will be available after it is configured.</p>}<button type="button" onClick={() => { setMode('register'); setError(''); }} className="mt-5 w-full text-sm font-bold text-rose">Create a customer account</button></> : <button type="button" onClick={() => { setMode('login'); setError(''); }} className="mt-5 w-full text-sm font-bold text-rose">Already have an account? Sign in</button>}<Link to="/" className="mt-5 block text-center text-sm text-rose">Continue as a guest</Link></form></motion.div>;
}
