import { useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppStore } from '../lib/store';
import { Report } from '../types';

// Subscribe to ALL reports — feeds global store
export function useReports(): Report[] {
  const setReports = useAppStore((s) => s.setReports);
  const reports = useAppStore((s) => s.reports);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'reports'),
      (snap) => {
        const data = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Report));
        setReports(data);
      },
      (err) => console.error('[useReports] error:', err)
    );
    return unsub;
  }, []);

  return reports;
}

// Derived: reports for a specific school (reads from store, no extra subscription)
export function useSchoolReports(schoolId: string): Report[] {
  const reports = useAppStore((s) => s.reports);
  return reports.filter((r) => r.schoolId === schoolId);
}

// Derived: reports for a specific promise
export function usePromiseReports(promiseId: string): Report[] {
  const reports = useAppStore((s) => s.reports);
  return reports.filter((r) => r.promiseId === promiseId);
}
