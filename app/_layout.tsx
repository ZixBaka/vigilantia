import '../global.css';
import '../constants/i18n';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  useEffect(() => {
    (async () => {
      let id = await AsyncStorage.getItem('userId');
      if (!id) {
        id = Date.now().toString(36) + Math.random().toString(36).slice(2);
        await AsyncStorage.setItem('userId', id);
      }
      setUserId(id);
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
