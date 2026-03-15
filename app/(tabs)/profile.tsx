import { useMemo } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory } from '../../types';

const ALL_CATEGORIES: IssueCategory[] = [
  'education', 'healthcare', 'transport', 'ecology',
  'safety', 'urban', 'utilities', 'water', 'energy',
];

interface BadgeDef {
  key: string;
  emoji: string;
  earned: boolean;
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const issues = useAppStore((s) => s.issues);
  const userId = useAppStore((s) => s.userId);

  const myIssues = useMemo(
    () => issues.filter((i) => i.createdBy === userId),
    [issues, userId],
  );

  const stats = useMemo(() => {
    const total = myIssues.length;
    const resolved = myIssues.filter((i) => i.status === 'done').length;
    const karma = total * 5 + resolved * 10;
    const categoriesUsed = new Set(myIssues.map((i) => i.category));
    return { total, resolved, karma, categoriesUsed };
  }, [myIssues]);

  const badges: BadgeDef[] = useMemo(() => [
    { key: 'firstStep',       emoji: '🌱', earned: stats.total >= 1 },
    { key: 'activeCitizen',   emoji: '📣', earned: stats.total >= 5 },
    { key: 'voiceOfDistrict', emoji: '🏙️', earned: stats.total >= 10 },
    { key: 'solver',          emoji: '✅', earned: stats.resolved >= 1 },
    { key: 'inspector',       emoji: '🔍', earned: stats.categoriesUsed.size >= 3 },
    { key: 'ecologist',       emoji: '🌿', earned: stats.categoriesUsed.has('ecology') },
    { key: 'guardian',        emoji: '🛡️', earned: stats.categoriesUsed.has('safety') },
    { key: 'allRounder',      emoji: '🔧', earned: ALL_CATEGORIES.every((c) => stats.categoriesUsed.has(c)) },
  ], [stats]);

  const earnedCount = badges.filter((b) => b.earned).length;

  // Max karma for the XP bar (100 karma = full bar, soft cap display)
  const xpPct = Math.min(100, Math.round((stats.karma / 100) * 100));
  const initials = userId ? userId.slice(0, 2).toUpperCase() : '??';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}
    >
      {/* Avatar + Karma header */}
      <View
        style={{
          backgroundColor: COLORS.brand,
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View
          style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white }}>{initials}</Text>
        </View>

        <Text style={{ fontSize: 32, fontWeight: '900', color: COLORS.white }}>
          {stats.karma}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: -6 }}>
          {t('profile.karma')} · {t('profile.karmaDesc')}
        </Text>

        {/* XP bar */}
        <View style={{ width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
          <View
            style={{
              width: `${xpPct}%`,
              height: '100%',
              backgroundColor: COLORS.white,
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* Quick stats row */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.brand }}>{stats.total}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.issuesCount')}
          </Text>
        </View>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.success }}>{stats.resolved}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.resolvedCount')}
          </Text>
        </View>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.warning }}>{earnedCount}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.badges')}
          </Text>
        </View>
      </View>

      {/* Badges section */}
      <View>
        <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 }}>
          {t('profile.badges')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {badges.map((badge) => (
            <View
              key={badge.key}
              style={{
                width: '30.5%',
                backgroundColor: badge.earned ? COLORS.white : COLORS.bgLight,
                borderRadius: 14,
                padding: 12,
                alignItems: 'center',
                gap: 6,
                borderWidth: badge.earned ? 1.5 : 1,
                borderColor: badge.earned ? COLORS.brand : COLORS.border,
                opacity: badge.earned ? 1 : 0.55,
              }}
            >
              <Text style={{ fontSize: 28 }}>{badge.emoji}</Text>
              <Text
                style={{
                  fontSize: 11, fontWeight: '700', textAlign: 'center',
                  color: badge.earned ? COLORS.textPrimary : COLORS.textSecondary,
                }}
                numberOfLines={2}
              >
                {t(`badge.${badge.key}`)}
              </Text>
              <Text
                style={{ fontSize: 9, color: COLORS.textSecondary, textAlign: 'center' }}
                numberOfLines={2}
              >
                {t(`badge.${badge.key}Desc`)}
              </Text>
              {!badge.earned && (
                <Ionicons name="lock-closed" size={12} color={COLORS.gray} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* My issues link */}
      <Pressable
        onPress={() => router.push('/(tabs)/issues')}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 14,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="warning-outline" size={22} color={COLORS.brand} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textPrimary }}>
            {t('profile.myIssues')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.brand }}>{stats.total}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
        </View>
      </Pressable>
    </ScrollView>
  );
}
