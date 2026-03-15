import { useState } from 'react';
import { View, Text, Platform, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory, IssueStatus, Issue } from '../../types';

const TASHKENT_REGION = {
  latitude: 41.2995,
  longitude: 69.2401,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

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

const ISSUE_STATUS_COLOR: Record<IssueStatus, string> = {
  open: COLORS.warning,
  done: COLORS.success,
  problem: COLORS.danger,
};

export default function MapScreen() {
  const { t } = useTranslation();
  const issues = useAppStore((s) => s.issues);
  const [selected, setSelected] = useState<Issue | null>(null);

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgLight }}>
        <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>
          Map is available on iOS and Android
        </Text>
      </View>
    );
  }

  const validIssues = issues.filter(
    (i) => i.id && typeof i.lat === 'number' && typeof i.lng === 'number' && !isNaN(i.lat) && !isNaN(i.lng)
  );

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={TASHKENT_REGION}
        showsUserLocation
        showsMyLocationButton
        onPress={() => setSelected(null)}
      >
        {validIssues.map((issue) => {
          const pinColor = ISSUE_STATUS_COLOR[issue.status] ?? COLORS.gray;
          const isSelected = selected?.id === issue.id;
          return (
            <Marker
              key={`issue-${issue.id}`}
              coordinate={{ latitude: issue.lat, longitude: issue.lng }}
              pinColor={pinColor}
              onPress={(e) => {
                e.stopPropagation();
                setSelected(issue);
              }}
              zIndex={isSelected ? 10 : 1}
            />
          );
        })}
      </MapView>

      {/* Legend */}
      <View
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: 14,
          padding: 12,
          gap: 6,
        }}
      >
        {[
          { color: COLORS.warning, label: t('issue.open') },
          { color: COLORS.success, label: t('issue.done') },
          { color: COLORS.danger, label: t('issue.problem') },
        ].map((item) => (
          <View key={item.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color }} />
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Bottom info card */}
      {selected && (
        <Pressable
          onPress={() => router.push(`/issue/${selected.id}`)}
          style={{
            position: 'absolute',
            bottom: 24,
            left: 16,
            right: 16,
            backgroundColor: COLORS.white,
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 12,
            elevation: 8,
            gap: 8,
          }}
        >
          {/* Category row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name={CATEGORY_ICON[selected.category]} size={14} color={COLORS.brand} />
            <Text style={{ fontSize: 12, color: COLORS.brand, fontWeight: '600' }}>
              {t(`cat.${selected.category}`)}
            </Text>
            <View
              style={{
                marginLeft: 'auto',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                backgroundColor: (ISSUE_STATUS_COLOR[selected.status]) + '22',
                borderRadius: 20,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: ISSUE_STATUS_COLOR[selected.status] }} />
              <Text style={{ fontSize: 11, color: ISSUE_STATUS_COLOR[selected.status], fontWeight: '600' }}>
                {t(`issue.${selected.status}`)}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={{ fontWeight: '700', fontSize: 16, color: COLORS.textPrimary, lineHeight: 22 }} numberOfLines={2}>
            {selected.title}
          </Text>

          {/* Footer: upvotes + open button */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="arrow-up-circle-outline" size={15} color={COLORS.gray} />
            <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginLeft: 4, fontWeight: '600' }}>
              {selected.upvotes ?? 0}
            </Text>
            <View style={{ flex: 1 }} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: COLORS.brand,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 6,
              }}
            >
              <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: '700' }}>
                Подробнее
              </Text>
              <Ionicons name="arrow-forward" size={13} color={COLORS.white} />
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}
