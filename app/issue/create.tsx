import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory } from '../../types';

const CATEGORIES: IssueCategory[] = [
  'education', 'healthcare', 'transport', 'ecology',
  'safety', 'urban', 'utilities', 'water', 'energy',
];

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

const PLACEHOLDER_PHOTO =
  'https://via.placeholder.com/400x300.png?text=Photo';

export default function CreateIssueScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const userId = useAppStore((s) => s.userId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationStatus('error');
        return;
      }
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        setLocationStatus('ok');
      } catch {
        setLocationStatus('error');
      }
    })();
  }, []);

  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function pickPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  }

  async function submit() {
    if (!title.trim()) {
      Alert.alert('', t('issue.titlePlaceholder'));
      return;
    }
    if (!category) {
      Alert.alert('', t('issue.pickCategory'));
      return;
    }
    const lat = location?.lat ?? 41.2995;
    const lng = location?.lng ?? 69.2401;

    setSubmitting(true);
    try {
      let photoUrl = PLACEHOLDER_PHOTO;
      if (photoUri) {
        const resp = await fetch(photoUri);
        const blob = await resp.blob();
        const storageRef = ref(storage, `issues/${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
        photoUrl = await getDownloadURL(storageRef);
      }

      const docRef = await addDoc(collection(db, 'issues'), {
        title: title.trim(),
        description: description.trim(),
        category,
        status: 'open',
        photoUrl,
        lat,
        lng,
        createdBy: userId,
        timestamp: serverTimestamp(),
      });

      router.back();
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Location status */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 8,
          padding: 10, borderRadius: 8,
          backgroundColor: locationStatus === 'ok' ? '#DCFCE7' : locationStatus === 'error' ? '#FEE2E2' : '#FEF9C3',
        }}
      >
        {locationStatus === 'loading' && <ActivityIndicator size="small" color={COLORS.warning} />}
        {locationStatus === 'ok' && <Ionicons name="location" size={16} color={COLORS.success} />}
        {locationStatus === 'error' && <Ionicons name="location-outline" size={16} color={COLORS.danger} />}
        <Text style={{ fontSize: 13, color: COLORS.textPrimary }}>
          {t(`issue.${locationStatus === 'loading' ? 'gettingLocation' : locationStatus === 'ok' ? 'locationOk' : 'locationError'}`)}
        </Text>
      </View>

      {/* Category picker */}
      <Text style={{ fontWeight: '600', color: COLORS.textPrimary }}>{t('issue.pickCategory')}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 12, paddingVertical: 8,
                borderRadius: 20, borderWidth: 1.5,
                borderColor: active ? COLORS.brand : COLORS.border,
                backgroundColor: active ? COLORS.brand : COLORS.white,
              }}
            >
              <Ionicons
                name={CATEGORY_ICON[cat]}
                size={14}
                color={active ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={{ fontSize: 13, color: active ? COLORS.white : COLORS.textSecondary }}>
                {t(`cat.${cat}`)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Title */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={t('issue.titlePlaceholder')}
        placeholderTextColor={COLORS.gray}
        style={{
          backgroundColor: COLORS.white, borderRadius: 10, padding: 12,
          borderWidth: 1, borderColor: COLORS.border,
          color: COLORS.textPrimary, fontSize: 15,
        }}
      />

      {/* Description */}
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder={t('issue.descPlaceholder')}
        placeholderTextColor={COLORS.gray}
        multiline
        numberOfLines={3}
        style={{
          backgroundColor: COLORS.white, borderRadius: 10, padding: 12,
          borderWidth: 1, borderColor: COLORS.border,
          color: COLORS.textPrimary, fontSize: 14,
          minHeight: 80, textAlignVertical: 'top',
        }}
      />

      {/* Photo */}
      {photoUri ? (
        <View>
          <Image source={{ uri: photoUri }} style={{ width: '100%', height: 200, borderRadius: 10 }} />
          <Pressable
            onPress={takePhoto}
            style={{ marginTop: 8, alignItems: 'center' }}
          >
            <Text style={{ color: COLORS.brand }}>{t('report.retakePhoto')}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={takePhoto}
            style={{
              flex: 1, padding: 14, borderRadius: 10, borderWidth: 1.5,
              borderColor: COLORS.brand, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
            }}
          >
            <Ionicons name="camera-outline" size={20} color={COLORS.brand} />
            <Text style={{ color: COLORS.brand }}>{t('report.takePhoto')}</Text>
          </Pressable>
          <Pressable
            onPress={pickPhoto}
            style={{
              flex: 1, padding: 14, borderRadius: 10, borderWidth: 1.5,
              borderColor: COLORS.border, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: 8,
              backgroundColor: COLORS.white,
            }}
          >
            <Ionicons name="image-outline" size={20} color={COLORS.textSecondary} />
            <Text style={{ color: COLORS.textSecondary }}>Галерея</Text>
          </Pressable>
        </View>
      )}

      {/* Submit */}
      <Pressable
        onPress={submit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? COLORS.gray : COLORS.brand,
          padding: 16, borderRadius: 12, alignItems: 'center',
        }}
      >
        {submitting
          ? <ActivityIndicator color={COLORS.white} />
          : <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 16 }}>
              {t('issue.submit')}
            </Text>
        }
      </Pressable>
    </ScrollView>
  );
}
