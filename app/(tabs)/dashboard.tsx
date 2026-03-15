import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../lib/store';
import { useStats } from '../../hooks/useStats';
import { seedDemoReports } from '../../lib/seed';
import StatCard from '../../components/StatCard';
import { COLORS, PIN_COLORS } from '../../constants/colors';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const schools = useAppStore((s) => s.schools);
  const stats = useStats(schools);
  const [longPressCount, setLongPressCount] = useState(0);
  const [seeding, setSeeding] = useState(false);

  // Hidden demo reset: long-press the title 3 times
  const handleTitleLongPress = async () => {
    const count = longPressCount + 1;
    setLongPressCount(count);
    if (count >= 3) {
      setLongPressCount(0);
      Alert.alert(
        t('dashboard.resetDemo'),
        'Add demo reports to show realistic data?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Seed Data',
            onPress: async () => {
              setSeeding(true);
              await seedDemoReports();
              setSeeding(false);
              Alert.alert('Done', 'Demo data loaded!');
            },
          },
        ]
      );
    }
  };

  const schoolsWithReports = schools
    .map((s) => ({ school: s, stats: stats.schoolStatsMap[s.id] }))
    .filter((item) => item.stats && item.stats.total > 0)
    .sort((a, b) => (b.stats?.total ?? 0) - (a.stats?.total ?? 0));

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bgLight }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      {seeding && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <ActivityIndicator color={COLORS.brand} />
          <Text style={{ color: COLORS.textSecondary, marginTop: 6 }}>{t('dashboard.seeding')}</Text>
        </View>
      )}

      <TouchableOpacity onLongPress={handleTitleLongPress} activeOpacity={1}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 20 }}>
          {t('dashboard.title')}
        </Text>
      </TouchableOpacity>

      {/* Stats grid */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <StatCard
          label={t('dashboard.totalReports')}
          value={stats.totalReports}
          color={COLORS.brand}
        />
        <StatCard
          label={t('dashboard.satisfied')}
          value={stats.satisfactionPct}
          unit="%"
          color={stats.satisfactionPct >= 70 ? COLORS.success : COLORS.warning}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <StatCard
          label={t('dashboard.verified')}
          value={stats.verifiedSchoolCount}
          color={COLORS.brand}
        />
        <StatCard
          label={t('dashboard.problems')}
          value={stats.problemCount}
          color={COLORS.danger}
        />
      </View>

      {/* Global progress bar */}
      {stats.totalReports > 0 && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>
              {stats.doneCount} / {stats.totalReports} {t('status.done').toLowerCase()}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.success }}>
              {stats.satisfactionPct}%
            </Text>
          </View>
          <View style={{ height: 10, backgroundColor: COLORS.bgLight, borderRadius: 5, overflow: 'hidden' }}>
            <View
              style={{
                width: `${stats.satisfactionPct}%`,
                height: '100%',
                backgroundColor: COLORS.success,
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      )}

      {/* Per-school breakdown */}
      {schoolsWithReports.length > 0 && (
        <>
          <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 12 }}>
            {t('dashboard.bySchool')}
          </Text>
          {schoolsWithReports.map(({ school, stats: schoolStats }) => {
            if (!schoolStats) return null;
            const color = PIN_COLORS[schoolStats.color];
            return (
              <View
                key={school.id}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.textPrimary }}>
                      {school.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{school.district}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color }}>
                      {schoolStats.satisfactionPct}%
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.gray }}>
                      {schoolStats.total} {t('schools.reports')}
                    </Text>
                  </View>
                </View>
                <View style={{ height: 6, backgroundColor: COLORS.bgLight, borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${schoolStats.satisfactionPct}%`,
                      height: '100%',
                      backgroundColor: color,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </>
      )}

      {stats.totalReports === 0 && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 48 }}>📊</Text>
          <Text style={{ color: COLORS.textSecondary, fontSize: 15, marginTop: 12, textAlign: 'center' }}>
            No reports yet.{'\n'}Be the first to verify a school!
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
