import { View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory, IssueStatus } from '../../types';

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

  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgLight }}>
        <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>
          Map is available on iOS and Android
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={TASHKENT_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {issues
          .filter(
            (issue) =>
              issue.id &&
              typeof issue.lat === 'number' &&
              typeof issue.lng === 'number' &&
              !isNaN(issue.lat) &&
              !isNaN(issue.lng)
          )
          .map((issue) => {
            const pinColor = ISSUE_STATUS_COLOR[issue.status] ?? COLORS.gray;
            return (
              <Marker
                key={`issue-${issue.id}`}
                coordinate={{ latitude: issue.lat, longitude: issue.lng }}
                pinColor={pinColor}
              >
                <Callout onPress={() => router.push(`/issue/${issue.id}`)} tooltip>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: 12,
                      padding: 12,
                      minWidth: 160,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 6,
                      elevation: 5,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Ionicons name={CATEGORY_ICON[issue.category]} size={13} color={COLORS.brand} />
                      <Text style={{ fontSize: 11, color: COLORS.brand }}>{t(`cat.${issue.category}`)}</Text>
                    </View>
                    <Text
                      style={{ fontWeight: '700', fontSize: 13, color: COLORS.textPrimary }}
                      numberOfLines={2}
                    >
                      {issue.title}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: pinColor }} />
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>
                        {t(`issue.${issue.status}`)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: COLORS.brand,
                        borderRadius: 8,
                        paddingVertical: 6,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 12 }}>
                        Подробнее →
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Callout>
              </Marker>
            );
          })}
      </MapView>

      {/* Legend */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
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
    </View>
  );
}
