import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory, IssueStatus } from '../../types';

const CATEGORY_ICON: Record<IssueCategory, keyof typeof Ionicons.glyphMap> = {
  education: 'book-outline',
  healthcare: 'medical-outline',
  transport: 'car-outline',
  ecology: 'leaf-outline',
  safety: 'shield-outline',
  urban: 'business-outline',
  utilities: 'home-outline',
  water: 'water-outline',
  energy: 'flash-outline',
};

const STATUS_COLOR: Record<IssueStatus, string> = {
  open: COLORS.warning,
  done: COLORS.success,
  problem: COLORS.danger,
};

const ALL_CATEGORIES: IssueCategory[] = [
  'education', 'healthcare', 'transport', 'ecology',
  'safety', 'urban', 'utilities', 'water', 'energy',
];

type QuickFilter = 'all' | 'mine';

export default function IssuesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const issues = useAppStore((s) => s.issues);
  const userId = useAppStore((s) => s.userId);

  const [quick, setQuick] = useState<QuickFilter>('all');
  const [selectedCat, setSelectedCat] = useState<IssueCategory | null>(null);

  const baseIssues = useMemo(
    () => quick === 'mine' ? issues.filter((i) => i.createdBy === userId) : issues,
    [issues, quick, userId],
  );

  const catStats = useMemo(() => {
    return Object.fromEntries(
      ALL_CATEGORIES.map((cat) => {
        const catIssues = baseIssues.filter((i) => i.category === cat);
        return [cat, {
          open: catIssues.filter((i) => i.status === 'open').length,
          done: catIssues.filter((i) => i.status === 'done').length,
          problem: catIssues.filter((i) => i.status === 'problem').length,
        }];
      }),
    ) as Record<IssueCategory, { open: number; done: number; problem: number }>;
  }, [baseIssues]);

  const filtered = useMemo(
    () => selectedCat ? baseIssues.filter((i) => i.category === selectedCat) : baseIssues,
    [baseIssues, selectedCat],
  );

  function handleCatPress(cat: IssueCategory) {
    setSelectedCat((prev) => (prev === cat ? null : cat));
  }

  const ListHeader = (
    <View>
      {/* Quick filter pills */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 }}>
        {(['all', 'mine'] as QuickFilter[]).map((key) => {
          const active = quick === key;
          return (
            <Pressable
              key={key}
              onPress={() => { setQuick(key); setSelectedCat(null); }}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: active ? COLORS.brand : COLORS.white,
                borderWidth: 1,
                borderColor: active ? COLORS.brand : COLORS.border,
              }}
            >
              <Text style={{ color: active ? COLORS.white : COLORS.textSecondary, fontSize: 13, fontWeight: '600' }}>
                {key === 'all' ? t('issues.all') : t('issues.mine')}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Category stat grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, gap: 8, paddingBottom: 12 }}>
        {ALL_CATEGORIES.map((cat) => {
          const stats = catStats[cat];
          const active = selectedCat === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => handleCatPress(cat)}
              style={{
                width: '30.5%',
                backgroundColor: active ? '#EFF6FF' : COLORS.white,
                borderRadius: 12,
                padding: 10,
                borderWidth: 1.5,
                borderColor: active ? COLORS.brand : COLORS.border,
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 3,
                elevation: 1,
              }}
            >
              <Ionicons
                name={CATEGORY_ICON[cat]}
                size={20}
                color={active ? COLORS.brand : COLORS.gray}
                style={{ marginBottom: 4 }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: active ? COLORS.brand : COLORS.textPrimary,
                  marginBottom: 6,
                }}
                numberOfLines={2}
              >
                {t(`cat.${cat}`)}
              </Text>
              <View style={{ gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.warning }} />
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>{stats.open}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success }} />
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>{stats.done}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.danger }} />
                  <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>{stats.problem}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id ?? item.timestamp?.toString()}
        contentContainerStyle={{ paddingHorizontal: 12, gap: 10, paddingBottom: 100 }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: COLORS.textSecondary }}>
            {t('issues.empty')}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/issue/${item.id}`)}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              gap: 12,
              shadowColor: '#000',
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={{ width: 64, height: 64, borderRadius: 8 }} />
            ) : (
              <View
                style={{
                  width: 64, height: 64, borderRadius: 8,
                  backgroundColor: COLORS.bgLight,
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name={CATEGORY_ICON[item.category] ?? 'alert-circle-outline'} size={28} color={COLORS.brand} />
              </View>
            )}
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontWeight: '600', color: COLORS.textPrimary, fontSize: 14 }} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                {t(`cat.${item.category}`)}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_COLOR[item.status] ?? COLORS.gray }} />
                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>{t(`issue.${item.status}`)}</Text>
                {item.createdBy === userId && (
                  <Text style={{ color: COLORS.brand, fontSize: 11, marginLeft: 4 }}>• {t('issues.mine')}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray} style={{ alignSelf: 'center' }} />
          </Pressable>
        )}
      />

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/issue/create')}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: COLORS.brand,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}
