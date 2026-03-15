import { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../lib/store';
import { useStats } from '../../hooks/useStats';
import { COLORS, PIN_COLORS } from '../../constants/colors';

const TASHKENT_REGION = {
  latitude: 41.2995,
  longitude: 69.2401,
  latitudeDelta: 0.18,
  longitudeDelta: 0.18,
};

export default function MapScreen() {
  const { t } = useTranslation();
  const schools = useAppStore((s) => s.schools);
  const stats = useStats(schools);

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
        {schools.map((school) => {
          const schoolStats = stats.schoolStatsMap[school.id];
          const color = schoolStats ? PIN_COLORS[schoolStats.color] : COLORS.gray;

          return (
            <Marker
              key={school.id}
              coordinate={{ latitude: school.lat, longitude: school.lng }}
              pinColor={color}
            >
              <Callout
                onPress={() => router.push(`/school/${school.id}`)}
                tooltip
              >
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
                  <Text style={{ fontWeight: '700', fontSize: 14, color: COLORS.textPrimary }}>
                    {school.name}
                  </Text>
                  <Text style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>
                    {school.district}
                  </Text>
                  {schoolStats && schoolStats.total > 0 && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={{ fontSize: 12, color }}>
                        {schoolStats.satisfactionPct}% {t('dashboard.satisfied').toLowerCase()}
                      </Text>
                      <Text style={{ fontSize: 11, color: COLORS.gray }}>
                        {schoolStats.total} {t('schools.reports')}
                      </Text>
                    </View>
                  )}
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
                      {t('school.verify')} →
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
          { color: COLORS.success, label: t('status.done') },
          { color: COLORS.warning, label: 'Смешанный' },
          { color: COLORS.danger, label: t('status.problem') },
          { color: COLORS.gray, label: t('status.noReports') },
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
