import { useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppStore } from '../lib/store';
import { School } from '../types';

export function useSchools(): School[] {
  const setSchools = useAppStore((s) => s.setSchools);
  const schools = useAppStore((s) => s.schools);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'schools'),
      (snap) => {
        const data = snap.docs.map((d) => ({ ...d.data(), id: d.id } as School));
        setSchools(data);
      },
      (err) => console.error('[useSchools] error:', err)
    );
    return unsub;
  }, []);

  return schools;
}
