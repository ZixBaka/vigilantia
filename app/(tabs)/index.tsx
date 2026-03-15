import { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../lib/store';
import { useStats } from '../../hooks/useStats';
import SchoolCard from '../../components/SchoolCard';
import { COLORS } from '../../constants/colors';

export default function SchoolsScreen() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const schools = useAppStore((s) => s.schools);
  const stats = useStats(schools);

  const filtered = useMemo(() => {
    if (!query.trim()) return schools;
    const q = query.toLowerCase();
    return schools.filter(
      (s) => s.name.toLowerCase().includes(q) || s.district.toLowerCase().includes(q)
    );
  }, [schools, query]);

  if (schools.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgLight }}>
        <ActivityIndicator size="large" color={COLORS.brand} />
        <Text style={{ marginTop: 12, color: COLORS.textSecondary }}>{t('schools.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            gap: 8,
          }}
        >
          <Ionicons name="search-outline" size={18} color={COLORS.gray} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('schools.search')}
            placeholderTextColor={COLORS.gray}
            style={{ flex: 1, fontSize: 15, color: COLORS.textPrimary }}
          />
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SchoolCard school={item} stats={stats.schoolStatsMap[item.id]} />
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="school-outline" size={48} color={COLORS.gray} />
            <Text style={{ color: COLORS.textSecondary, marginTop: 12, fontSize: 15 }}>
              {t('schools.empty')}
            </Text>
          </View>
        }
      />
    </View>
  );
}
