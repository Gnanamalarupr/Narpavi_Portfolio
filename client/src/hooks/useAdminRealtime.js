import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { apiBase } from '../services/api';

export default function useAdminRealtime(handlers, enabled) {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;
  useEffect(() => {
    if (!enabled) return undefined;
    const socket = io(apiBase.replace('/api', ''), { auth: { token: localStorage.getItem('maison-token') } });
    const listeners = Object.entries(handlersRef.current);
    listeners.forEach(([event, handler]) => socket.on(event, handler));
    return () => socket.disconnect();
  }, [enabled]);
}