import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useAppStore } from '../../lib/store';
import { Report, ReportStatus } from '../../types';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const PLACEHOLDER_PHOTO = 'https://picsum.photos/seed/report-placeholder/400/300';
const DEMO_USER = 'demo-user';

export default function ReportScreen() {
  const { id: promiseId, schoolId } = useLocalSearchParams<{ id: string; schoolId: string }>();
  const { t } = useTranslation();
  const addReport = useAppStore((s) => s.addReport);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<ReportStatus | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      // Fallback: pick from library
      const libPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!libPerm.granted) {
        Alert.alert('Permission needed', 'Camera or photo library access is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const uploadPhoto = async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const path = `reports/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
      const ref = storageRef(storage, path);
      await uploadBytes(ref, blob);
      return await getDownloadURL(ref);
    } catch (e) {
      console.warn('[upload] Firebase Storage upload failed, using placeholder:', e);
      return PLACEHOLDER_PHOTO;
    }
  };

  const handleSubmit = async () => {
    if (!status) {
      Alert.alert('', t('report.selectStatus'));
      return;
    }
    if (!photoUri && Platform.OS !== 'web') {
      Alert.alert('', t('report.photoRequired'));
      return;
    }

    setSubmitting(true);
    try {
      let photoUrl = PLACEHOLDER_PHOTO;
      if (photoUri) {
        photoUrl = await uploadPhoto(photoUri);
      }

      const reportData = {
        schoolId: schoolId ?? '',
        promiseId: promiseId ?? '',
        status,
        photoUrl,
        comment: comment.trim(),
        timestamp: serverTimestamp(),
        userId: DEMO_USER,
      };

      const docRef = await addDoc(collection(db, 'reports'), reportData);

      addReport({ ...reportData, id: docRef.id } as Report);

      Alert.alert('✓', t('report.success'), [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error('[report] submit error:', e);
      Alert.alert('Error', 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t('report.title') }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.bgLight }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo section */}
        <TouchableOpacity
          onPress={takePhoto}
          style={{
            width: '100%',
            height: 220,
            backgroundColor: COLORS.white,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
            overflow: 'hidden',
            borderWidth: photoUri ? 0 : 2,
            borderColor: COLORS.border,
            borderStyle: 'dashed',
          }}
          activeOpacity={0.85}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : (
            <View style={{ alignItems: 'center', gap: 10 }}>
              <Ionicons name="camera-outline" size={48} color={COLORS.brand} />
              <Text style={{ color: COLORS.brand, fontWeight: '600', fontSize: 16 }}>
                {t('report.takePhoto')}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {photoUri && (
          <TouchableOpacity onPress={takePhoto} style={{ alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ color: COLORS.brand, fontWeight: '600' }}>{t('report.retakePhoto')}</Text>
          </TouchableOpacity>
        )}

        {/* Status buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <TouchableOpacity
            onPress={() => setStatus('done')}
            style={{
              flex: 1,
              backgroundColor: status === 'done' ? COLORS.success : COLORS.white,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: status === 'done' ? COLORS.success : COLORS.border,
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="checkmark-circle"
              size={32}
              color={status === 'done' ? COLORS.white : COLORS.success}
            />
            <Text
              style={{
                marginTop: 6,
                fontWeight: '700',
                fontSize: 16,
                color: status === 'done' ? COLORS.white : COLORS.success,
              }}
            >
              {t('report.done')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setStatus('problem')}
            style={{
              flex: 1,
              backgroundColor: status === 'problem' ? COLORS.danger : COLORS.white,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              borderWidth: 2,
              borderColor: status === 'problem' ? COLORS.danger : COLORS.border,
            }}
            activeOpacity={0.85}
          >
            <Ionicons
              name="close-circle"
              size={32}
              color={status === 'problem' ? COLORS.white : COLORS.danger}
            />
            <Text
              style={{
                marginTop: 6,
                fontWeight: '700',
                fontSize: 16,
                color: status === 'problem' ? COLORS.white : COLORS.danger,
              }}
            >
              {t('report.problem')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Comment */}
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder={t('report.commentPlaceholder')}
          placeholderTextColor={COLORS.gray}
          multiline
          numberOfLines={3}
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 14,
            padding: 14,
            fontSize: 15,
            color: COLORS.textPrimary,
            minHeight: 90,
            textAlignVertical: 'top',
            marginBottom: 20,
          }}
        />

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          style={{
            backgroundColor: submitting ? COLORS.gray : COLORS.brand,
            borderRadius: 16,
            paddingVertical: 18,
            alignItems: 'center',
          }}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={{ color: COLORS.white, fontWeight: '800', fontSize: 17 }}>
              {t('report.submit')}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
