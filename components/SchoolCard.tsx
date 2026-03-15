import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { School, SchoolStats } from '../types';
import { COLORS, PIN_COLORS } from '../constants/colors';
import StatusBadge from './StatusBadge';

interface Props {
  school: School;
  stats?: SchoolStats;
}

export default function SchoolCard({ school, stats }: Props) {
  const { t } = useTranslation();

  const dotColor = stats ? PIN_COLORS[stats.color] : COLORS.gray;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/school/${school.id}`)}
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: school.coverPhotoUrl }}
        style={{ width: '100%', height: 120 }}
        resizeMode="cover"
      />
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textPrimary }}>{school.name}</Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>{school.district}</Text>
          </View>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: dotColor, marginTop: 4 }} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 }}>
          {stats && stats.total > 0 ? (
            <>
              <StatusBadge status={stats.color} size="sm" />
              <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
                {stats.total} {t('schools.reports')}
              </Text>
            </>
          ) : (
            <Text style={{ fontSize: 12, color: COLORS.gray }}>
              {school.promises.length} обещаний
            </Text>
          )}
        </View>

        {stats && stats.total > 0 && (
          <View style={{ marginTop: 8, height: 4, backgroundColor: COLORS.bgLight, borderRadius: 2, overflow: 'hidden' }}>
            <View
              style={{
                width: `${stats.satisfactionPct}%`,
                height: '100%',
                backgroundColor: dotColor,
                borderRadius: 2,
              }}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
