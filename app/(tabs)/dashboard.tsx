import { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../lib/store';
import StatCard from '../../components/StatCard';
import { COLORS } from '../../constants/colors';
import { IssueCategory } from '../../types';

const ALL_CATEGORIES: IssueCategory[] = [
  'education', 'healthcare', 'transport', 'ecology',
  'safety', 'urban', 'utilities', 'water', 'energy',
];

export default function DashboardScreen() {
  const { t } = useTranslation();
  const issues = useAppStore((s) => s.issues);

  const stats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter((i) => i.status === 'open').length;
    const resolved = issues.filter((i) => i.status === 'done').length;
    const problems = issues.filter((i) => i.status === 'problem').length;

    const byCategory: Record<IssueCategory, { total: number; resolved: number }> = {} as any;
    for (const cat of ALL_CATEGORIES) {
      const catIssues = issues.filter((i) => i.category === cat);
      byCategory[cat] = {
        total: catIssues.length,
        resolved: catIssues.filter((i) => i.status === 'done').length,
      };
    }

    return { total, open, resolved, problems, byCategory };
  }, [issues]);

  const activeCats = ALL_CATEGORIES.filter((cat) => stats.byCategory[cat].total > 0);

  if (stats.total === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgLight }}>
        <Text style={{ fontSize: 48 }}>📊</Text>
        <Text style={{ color: COLORS.textSecondary, fontSize: 15, marginTop: 12, textAlign: 'center' }}>
          {t('issues.empty')}{'\n'}{t('issues.create')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
    >
      <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textPrimary }}>
        {t('tab.dashboard')}
      </Text>

      {/* Top stats */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label={t('issue.totalIssues')} value={stats.total} color={COLORS.brand} />
        <StatCard label={t('issue.openCount')} value={stats.open} color={COLORS.warning} />
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <StatCard label={t('issue.resolvedCount')} value={stats.resolved} color={COLORS.success} />
        <StatCard label={t('dashboard.problems')} value={stats.problems} color={COLORS.danger} />
      </View>

      {/* Per-category breakdown */}
      {activeCats.length > 0 && (
        <>
          <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginTop: 8 }}>
            {t('issue.pickCategory')}
          </Text>
          {activeCats.map((cat) => {
            const { total, resolved } = stats.byCategory[cat];
            const pct = total === 0 ? 0 : Math.round((resolved / total) * 100);
            return (
              <View
                key={cat}
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: COLORS.textPrimary }}>
                    {t(`cat.${cat}`)}
                  </Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.success }}>
                      {pct}%
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.gray }}>{total} {t('issue.totalIssues').toLowerCase()}</Text>
                  </View>
                </View>
                <View style={{ height: 6, backgroundColor: COLORS.bgLight, borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: COLORS.success,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}
