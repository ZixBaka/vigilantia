import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../../lib/firebase';
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

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const issues = useAppStore((s) => s.issues);
  const userId = useAppStore((s) => s.userId);
  const updateIssue = useAppStore((s) => s.updateIssue);

  const toggleUpvote = useAppStore((s) => s.toggleUpvote);

  const issue = issues.find((i) => i.id === id);
  const [updating, setUpdating] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({ title: issue?.title ?? '' });
  }, [issue?.title]);

  if (!issue) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  const isOwner = issue.createdBy === userId;
  const voted = (issue.upvoters ?? []).includes(userId);

  async function handleUpvote() {
    if (!issue?.id) return;
    toggleUpvote(issue.id, userId);
    try {
      await updateDoc(doc(db, 'issues', issue.id), {
        upvoters: voted ? arrayRemove(userId) : arrayUnion(userId),
        upvotes: increment(voted ? -1 : 1),
      });
    } catch (e) {
      toggleUpvote(issue.id, userId); // revert
      Alert.alert('Error', String(e));
    }
  }

  async function changeStatus(newStatus: IssueStatus) {
    if (!issue?.id) return;
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'issues', issue.id), { status: newStatus });
      updateIssue(issue.id, { status: newStatus });
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bgLight }}>
      {/* Photo */}
      {issue.photoUrl ? (
        <Image
          source={{ uri: issue.photoUrl }}
          style={{ width: '100%', height: 240 }}
          resizeMode="cover"
        />
      ) : null}

      <View style={{ padding: 16, gap: 12 }}>
        {/* Category + Status row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
              borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Ionicons name={CATEGORY_ICON[issue.category]} size={14} color={COLORS.brand} />
            <Text style={{ fontSize: 13, color: COLORS.brand }}>{t(`cat.${issue.category}`)}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 6,
              borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
              backgroundColor: STATUS_COLOR[issue.status] + '22',
            }}
          >
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: STATUS_COLOR[issue.status] }} />
            <Text style={{ fontSize: 13, color: STATUS_COLOR[issue.status], fontWeight: '600' }}>
              {t(`issue.${issue.status}`)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textPrimary }}>
          {issue.title}
        </Text>

        {/* Description */}
        {!!issue.description && (
          <Text style={{ fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 }}>
            {issue.description}
          </Text>
        )}

        {/* Location */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="location-outline" size={15} color={COLORS.gray} />
          <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
            {issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}
          </Text>
        </View>

        {/* Upvote */}
        <Pressable
          onPress={handleUpvote}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: voted ? COLORS.brand + '15' : COLORS.bgLight,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1.5,
            borderColor: voted ? COLORS.brand : COLORS.border,
          }}
        >
          <Ionicons
            name={voted ? 'arrow-up-circle' : 'arrow-up-circle-outline'}
            size={32}
            color={voted ? COLORS.brand : COLORS.gray}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 22, color: voted ? COLORS.brand : COLORS.textPrimary }}>
              {issue.upvotes ?? 0}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
              {t('issue.upvotes')} · {voted ? t('issue.upvote') : t('issue.upvote')}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: voted ? COLORS.brand : COLORS.textSecondary, fontWeight: '600' }}>
            {voted ? '✓' : t('issue.upvote')}
          </Text>
        </Pressable>

        {/* Status change — owner only */}
        {isOwner && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <Text style={{ fontWeight: '600', color: COLORS.textPrimary }}>
              {t('issue.statusChange')}
            </Text>
            {updating ? (
              <ActivityIndicator color={COLORS.brand} />
            ) : (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {issue.status !== 'done' && (
                  <Pressable
                    onPress={() => changeStatus('done')}
                    style={{
                      flex: 1, padding: 12, borderRadius: 10,
                      backgroundColor: COLORS.success, alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700' }}>
                      {t('issue.markDone')}
                    </Text>
                  </Pressable>
                )}
                {issue.status !== 'problem' && (
                  <Pressable
                    onPress={() => changeStatus('problem')}
                    style={{
                      flex: 1, padding: 12, borderRadius: 10,
                      backgroundColor: COLORS.danger, alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700' }}>
                      {t('issue.markProblem')}
                    </Text>
                  </Pressable>
                )}
                {issue.status !== 'open' && (
                  <Pressable
                    onPress={() => changeStatus('open')}
                    style={{
                      flex: 1, padding: 12, borderRadius: 10,
                      backgroundColor: COLORS.warning, alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '700' }}>
                      {t('issue.reopen')}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}

        {!isOwner && (
          <View
            style={{
              padding: 12, borderRadius: 10,
              backgroundColor: COLORS.bgLight, borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Text style={{ color: COLORS.textSecondary, fontSize: 13, textAlign: 'center' }}>
              {t('issue.onlyOwner')}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
