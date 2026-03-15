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
import { ISSUES_SEED } from '../constants/issuesSeedData';

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

export async function seedDemoIssues(): Promise<void> {
  try {
    const snap = await getDocs(collection(db, 'issues'));
    if (!snap.empty) return;

    for (const issue of ISSUES_SEED) {
      await addDoc(collection(db, 'issues'), {
        ...issue,
        timestamp: serverTimestamp(),
      });
    }
    console.log('[seed] Demo issues seeded');
  } catch (e) {
    console.error('[seed] Failed to seed issues:', e);
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
