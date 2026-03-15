import '../global.css';
import '../constants/i18n';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { seedIfEmpty } from '../lib/seed';
import { useSchools } from '../hooks/useSchools';
import { useReports } from '../hooks/useReports';

// Inner component that bootstraps data subscriptions
function DataBootstrap() {
  useSchools();
  useReports();
  return null;
}

export default function RootLayout() {
  const { t } = useTranslation();

  useEffect(() => {
    seedIfEmpty();
  }, []);

  return (
    <>
      <DataBootstrap />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="school/[id]"
          options={{ title: '', headerBackTitle: t('tab.schools') }}
        />
        <Stack.Screen
          name="report/[id]"
          options={{ title: t('report.title') }}
        />
      </Stack>
    </>
  );
}
