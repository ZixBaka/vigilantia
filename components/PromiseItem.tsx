import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { SchoolPromise, Report } from '../types';
import { COLORS } from '../constants/colors';
import StatusBadge from './StatusBadge';

interface Props {
  promise: SchoolPromise;
  schoolId: string;
  reports: Report[];
}

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  sanitation: 'water-outline',
  safety: 'shield-checkmark-outline',
  education: 'book-outline',
};

export default function PromiseItem({ promise, schoolId, reports }: Props) {
  const { t } = useTranslation();

  const promiseReports = reports.filter((r) => r.promiseId === promise.id);
  const lastReport = promiseReports.sort(
    (a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0)
  )[0];

  const handleVerify = () => {
    router.push(`/report/${promise.id}?schoolId=${schoolId}`);
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: COLORS.bgLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons
          name={CATEGORY_ICONS[promise.category] ?? 'checkbox-outline'}
          size={20}
          color={COLORS.brand}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textPrimary }}>
          {t(promise.labelKey)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
          {lastReport ? (
            <StatusBadge status={lastReport.status} size="sm" />
          ) : (
            <Text style={{ fontSize: 12, color: COLORS.gray }}>{t('school.noReports')}</Text>
          )}
          {promiseReports.length > 0 && (
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
              {promiseReports.length} {t('schools.reports')}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={handleVerify}
        style={{
          backgroundColor: COLORS.brand,
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 10,
          marginLeft: 8,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>
          {t('school.verify')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
