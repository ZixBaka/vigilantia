import { useEffect } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppStore } from '../lib/store';
import { Issue } from '../types';

export function useIssues() {
  const setIssues = useAppStore((s) => s.setIssues);

  useEffect(() => {
    const q = query(collection(db, 'issues'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const issues: Issue[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Issue, 'id'>),
      }));
      setIssues(issues);
    });
    return unsub;
  }, []);
}
