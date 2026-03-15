import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../lib/store';
import { useSchoolReports } from '../../hooks/useReports';
import PromiseItem from '../../components/PromiseItem';
import StatusBadge from '../../components/StatusBadge';
import { COLORS } from '../../constants/colors';

export default function SchoolDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const schools = useAppStore((s) => s.schools);
  const school = schools.find((s) => s.id === id);
  const reports = useSchoolReports(id ?? '');

  if (!school) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.brand} />
      </View>
    );
  }

  const doneCount = reports.filter((r) => r.status === 'done').length;
  const satisfactionPct = reports.length > 0 ? Math.round((doneCount / reports.length) * 100) : 0;

  return (
    <>
      <Stack.Screen options={{ title: school.name }} />
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
        <Image
          source={{ uri: school.coverPhotoUrl }}
          style={{ width: '100%', height: 200 }}
          resizeMode="cover"
        />

        <View style={{ padding: 16 }}>
          {/* Header info */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: '800', color: COLORS.textPrimary }}>
              {school.name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 }}>
              <Ionicons name="location-outline" size={15} color={COLORS.textSecondary} />
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>{school.district}</Text>
            </View>

            {reports.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                    {reports.length} {t('schools.reports')}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: satisfactionPct >= 70 ? COLORS.success : COLORS.danger }}>
                    {satisfactionPct}%
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: COLORS.bgLight, borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${satisfactionPct}%`,
                      height: '100%',
                      backgroundColor: satisfactionPct >= 70 ? COLORS.success : COLORS.warning,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Promises */}
          <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 }}>
            {t('school.promised')}
          </Text>

          {school.promises.map((promise) => (
            <PromiseItem
              key={promise.id}
              promise={promise}
              schoolId={school.id}
              reports={reports}
            />
          ))}

          {/* Recent reports */}
          {reports.length > 0 && (
            <>
              <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8, marginBottom: 12 }}>
                {t('school.reports')}
              </Text>
              {reports
                .sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0))
                .slice(0, 5)
                .map((report, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <Image
                      source={{ uri: report.photoUrl }}
                      style={{ width: 52, height: 52, borderRadius: 8 }}
                      resizeMode="cover"
                    />
                    <View style={{ flex: 1 }}>
                      <StatusBadge status={report.status} size="sm" />
                      {report.comment ? (
                        <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4 }} numberOfLines={2}>
                          {report.comment}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}
