import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('maison-user') || 'null'));
  const [ready, setReady] = useState(false);
  useEffect(() => { const token = localStorage.getItem('maison-token'); if (!token) { setReady(true); return; } authApi.me().then((r) => setUser(r.data.data.user)).catch(() => { localStorage.removeItem('maison-token'); localStorage.removeItem('maison-user'); setUser(null); }).finally(() => setReady(true)); }, []);
  const login = async (credentials) => { const r = await authApi.login(credentials); const { token, user: nextUser } = r.data.data; localStorage.setItem('maison-token', token); localStorage.setItem('maison-user', JSON.stringify(nextUser)); setUser(nextUser); return nextUser; };
  const register = async (details) => { const r = await authApi.register(details); const { token, user: nextUser } = r.data.data; localStorage.setItem('maison-token', token); localStorage.setItem('maison-user', JSON.stringify(nextUser)); setUser(nextUser); return nextUser; };
  const loginWithGoogle = async (credential) => { const r = await authApi.google(credential); const { token, user: nextUser } = r.data.data; localStorage.setItem('maison-token', token); localStorage.setItem('maison-user', JSON.stringify(nextUser)); setUser(nextUser); return nextUser; };
  const logout = () => { localStorage.removeItem('maison-token'); localStorage.removeItem('maison-user'); setUser(null); };
  return <AuthContext.Provider value={{ user, ready, login, register, loginWithGoogle, logout, isAdmin: user?.role === 'admin' }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
