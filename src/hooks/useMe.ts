import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export function useMe() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        const me = await api.get('/auth/me');
        if (on) setUser(me);
      } catch (e: any) {
        if (on) setErr(e.message || 'AUTH');
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  return { user, loading, err };
}
