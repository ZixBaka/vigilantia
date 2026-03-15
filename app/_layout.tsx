import '../global.css';
import '../constants/i18n';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useIssues } from '../hooks/useIssues';
import { useAppStore } from '../lib/store';
import { seedDemoIssues } from '../lib/seed';

function DataBootstrap() {
  useIssues();
  return null;
}

export default function RootLayout() {
  const { t } = useTranslation();
  const setUserId = useAppStore((s) => s.setUserId);
  const setKarmaSpent = useAppStore((s) => s.setKarmaSpent);

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem('userId');
      if (!id) {
        id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        await AsyncStorage.setItem('userId', id);
      }
      setUserId(id);
      // Load spent karma from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setKarmaSpent(userDoc.data().karmaSpent ?? 0);
        } else {
          await setDoc(doc(db, 'users', id), { karmaSpent: 0 });
        }
      } catch (_) {}
      await seedDemoIssues();
    })();
  }, []);

  return (
    <>
      <DataBootstrap />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="issue/create"
          options={{ title: t('issues.create') }}
        />
        <Stack.Screen
          name="issue/[id]"
          options={{ title: '' }}
        />
      </Stack>
    </>
  );
}
