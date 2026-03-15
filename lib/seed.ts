import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { SCHOOLS_SEED, DEMO_REPORTS } from '../constants/seedData';

export async function seedIfEmpty(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'schools'));
    if (!snap.empty) return;

    for (const school of SCHOOLS_SEED) {
      await setDoc(doc(db, 'schools', school.id), school);
    }
    console.log('[seed] Schools seeded');
  } catch (e) {
    console.error('[seed] Failed to seed schools:', e);
  }
}

export async function seedDemoReports(): Promise<void> {
  try {
    // Clear existing reports first
    const existing = await getDocs(collection(db, 'reports'));
    // Just add new ones (don't delete for safety in demo)

    for (const report of DEMO_REPORTS) {
      await addDoc(collection(db, 'reports'), {
        ...report,
        timestamp: serverTimestamp(),
      });
    }
    console.log('[seed] Demo reports seeded');
  } catch (e) {
    console.error('[seed] Failed to seed reports:', e);
  }
}
