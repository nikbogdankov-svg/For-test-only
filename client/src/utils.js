import { useEffect, useState } from 'react';

// The API sends ISO-8601 UTC timestamps; show them in the visitor's local time.
export const formatDate = (ts) => new Date(ts).toLocaleString();

// Remember the visitor's name between visits so they don't have to retype it.
export function useSavedName() {
  const [name, setName] = useState(() => {
    try { return localStorage.getItem('name') || ''; } catch { return ''; }
  });
  useEffect(() => {
    try { localStorage.setItem('name', name); } catch { /* storage unavailable */ }
  }, [name]);
  return [name, setName];
}

// Load data on mount (and when `deps` change); returns { data, error, loading, reload }.
export function useLoad(load, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    load()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  return { ...state, reload: () => setVersion((v) => v + 1) };
}
