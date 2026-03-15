import { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, doc, getDocs, updateDoc, arrayUnion, increment, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAppStore } from '../../lib/store';
import { COLORS } from '../../constants/colors';
import { IssueCategory, PromoCode } from '../../types';

const ALL_CATEGORIES: IssueCategory[] = [
  'education', 'healthcare', 'transport', 'ecology',
  'safety', 'urban', 'utilities', 'water', 'energy',
];

interface BadgeDef {
  key: string;
  emoji: string;
  earned: boolean;
}

interface LandmarkCard {
  id: string;
  name: string;
  city: string;
  country: string;
  era: string;
  type: string;
  typeIcon: string;
  eraIcon: string;
  karmaRequired: number;
  bgTop: string;
  bgBottom: string;
  // Optional local image — place file in assets/cards/{id}.jpg and uncomment in LANDMARK_CARDS
  image?: any;
}

// Landmark cards — unlock at karma milestones
// To show real photos: save the 4 images as:
//   assets/cards/registan.jpg
//   assets/cards/amir-timur.jpg
//   assets/cards/independence.jpg
//   assets/cards/cultural.jpg
// Then uncomment the image: require(...) lines below.
const LANDMARK_CARDS: LandmarkCard[] = [
  {
    id: 'registan',
    name: 'Registan Square',
    city: 'Samarkand',
    country: 'Uzbekistan',
    era: '16th C.',
    type: 'Heritage Site',
    typeIcon: '🕌',
    eraIcon: '📜',
    karmaRequired: 100,
    bgTop: '#C4956A',
    bgBottom: '#6B3E26',
    // image: require('../../assets/cards/registan.jpg'),
  },
  {
    id: 'amir-timur',
    name: 'Amir Timur Square',
    city: 'Tashkent',
    country: 'Uzbekistan',
    era: '14th C.',
    type: 'Navoi Theater',
    typeIcon: '🐴',
    eraIcon: '🏛️',
    karmaRequired: 200,
    bgTop: '#5B99D0',
    bgBottom: '#1A4A7A',
    // image: require('../../assets/cards/amir-timur.jpg'),
  },
  {
    id: 'independence',
    name: 'Independence Monument',
    city: 'Tashkent',
    country: 'Uzbekistan',
    era: '1991',
    type: 'City Park',
    typeIcon: '🦅',
    eraIcon: '🌐',
    karmaRequired: 300,
    bgTop: '#E8C84A',
    bgBottom: '#2A7FC4',
    // image: require('../../assets/cards/independence.jpg'),
  },
  {
    id: 'cultural',
    name: 'Cultural Pavilion',
    city: 'Tashkent',
    country: 'Uzbekistan',
    era: 'Culture',
    type: 'Museum',
    typeIcon: '🏛️',
    eraIcon: '🌍',
    karmaRequired: 400,
    bgTop: '#DAF0F0',
    bgBottom: '#5BA8AC',
    // image: require('../../assets/cards/cultural.jpg'),
  },
];

function LandmarkCardItem({ card, karma }: { card: LandmarkCard; karma: number }) {
  const unlocked = karma >= card.karmaRequired;

  return (
    <View
      style={{
        width: 210,
        marginRight: 14,
        borderRadius: 18,
        borderWidth: 2.5,
        borderColor: unlocked ? '#A8B8CC' : '#888',
        backgroundColor: '#E8ECF0',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: unlocked ? 0.22 : 0.08,
        shadowRadius: 10,
        elevation: unlocked ? 8 : 3,
      }}
    >
      {/* Inner border frame */}
      <View
        style={{
          margin: 3,
          borderRadius: 14,
          borderWidth: 1.5,
          borderColor: unlocked ? '#7B8EA0' : '#AAA',
          overflow: 'hidden',
        }}
      >
        {/* Photo area */}
        <View style={{ height: 190, position: 'relative' }}>
          {card.image && unlocked ? (
            <Image
              source={card.image}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          ) : (
            /* Simulated photo with color blocks */
            <View style={{ flex: 1, backgroundColor: card.bgTop }}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0, height: '45%',
                  backgroundColor: card.bgBottom,
                  opacity: 0.75,
                }}
              />
            </View>
          )}

          {/* REAL HOLAT badge — top left */}
          <View
            style={{
              position: 'absolute', top: 10, left: 10,
              backgroundColor: 'rgba(15, 30, 70, 0.88)',
              borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
              borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '900', letterSpacing: 0.5 }}>
                REAL HOLAT
              </Text>
              <Text style={{ color: '#FFD700', fontSize: 11 }}>⌖</Text>
            </View>
            <Text style={{ color: '#AAC4FF', fontSize: 8, fontWeight: '600', letterSpacing: 1 }}>
              HACKATHON
            </Text>
          </View>

          {/* Lock overlay */}
          {!unlocked && (
            <View
              style={{
                position: 'absolute', inset: 0,
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.62)',
                alignItems: 'center', justifyContent: 'center',
                gap: 8,
              }}
            >
              <Ionicons name="lock-closed" size={36} color="white" />
              <View
                style={{
                  backgroundColor: COLORS.brand,
                  borderRadius: 20,
                  paddingHorizontal: 14,
                  paddingVertical: 6,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>
                  {card.karmaRequired} karma
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Name banner — gold */}
        <View
          style={{
            backgroundColor: unlocked ? '#F0C040' : '#C8C8C8',
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '900',
              fontStyle: 'italic',
              color: '#1A1A1A',
            }}
            numberOfLines={1}
          >
            {card.name}
          </Text>
        </View>

        {/* Info bar — dark */}
        <View
          style={{
            backgroundColor: '#1E2840',
            paddingHorizontal: 8,
            paddingVertical: 7,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            flexWrap: 'nowrap',
          }}
        >
          <Ionicons name="location" size={10} color="#FF6B6B" />
          <Text style={{ fontSize: 8.5, color: '#E0E8FF', fontWeight: '700', letterSpacing: 0.3 }} numberOfLines={1}>
            {card.city.toUpperCase()}, {card.country.slice(0, 3).toUpperCase()}
          </Text>
          <Text style={{ color: '#555', fontSize: 10 }}>  /</Text>
          <Text style={{ fontSize: 10 }}>{card.typeIcon}</Text>
          <Text style={{ fontSize: 8.5, color: '#C8D8FF', fontWeight: '600' }}>{card.era}</Text>
          <Text style={{ color: '#555', fontSize: 10 }}>  /</Text>
          <Text style={{ fontSize: 10 }}>{card.eraIcon}</Text>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={{ color: '#FFD700', fontSize: 10 }}>★</Text>
            <Text style={{ fontSize: 8, color: '#FFD700', fontWeight: '800' }}>RARE</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const issues = useAppStore((s) => s.issues);
  const userId = useAppStore((s) => s.userId);
  const karmaSpent = useAppStore((s) => s.karmaSpent);
  const addKarmaSpent = useAppStore((s) => s.addKarmaSpent);

  const [offers, setOffers] = useState<PromoCode[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  const myIssues = useMemo(
    () => issues.filter((i) => i.createdBy === userId),
    [issues, userId],
  );

  const stats = useMemo(() => {
    const total = myIssues.length;
    const resolved = myIssues.filter((i) => i.status === 'done').length;
    const karma = total * 5 + resolved * 10;
    const categoriesUsed = new Set(myIssues.map((i) => i.category));
    return { total, resolved, karma, categoriesUsed };
  }, [myIssues]);

  const availableKarma = stats.karma - karmaSpent;

  useEffect(() => {
    if (!userId) return;
    getDocs(query(collection(db, 'promoCodes'), where('active', '==', true)))
      .then((snap) => {
        setOffers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PromoCode)));
      })
      .catch(() => {})
      .finally(() => setLoadingOffers(false));
  }, [userId]);

  async function claimOffer(offer: PromoCode) {
    if (!offer.id || !userId) return;
    if (availableKarma < offer.karmaCost) {
      Alert.alert(t('promo.error'), t('promo.notEnough', { need: offer.karmaCost - availableKarma }));
      return;
    }
    setClaiming(offer.id);
    try {
      await updateDoc(doc(db, 'promoCodes', offer.id), {
        redeemedBy: arrayUnion(userId),
      });
      await updateDoc(doc(db, 'users', userId), {
        karmaSpent: increment(offer.karmaCost),
      });
      addKarmaSpent(offer.karmaCost);
      // Update local offers so UI shows the code immediately
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offer.id
            ? { ...o, redeemedBy: [...(o.redeemedBy ?? []), userId] }
            : o,
        ),
      );
      Alert.alert(
        t('promo.success'),
        t('promo.successMsg', { sponsor: offer.sponsorName, code: offer.codeValue }),
      );
    } catch (e) {
      Alert.alert('Error', String(e));
    } finally {
      setClaiming(null);
    }
  }

  const badges: BadgeDef[] = useMemo(() => [
    { key: 'firstStep',       emoji: '🌱', earned: stats.total >= 1 },
    { key: 'activeCitizen',   emoji: '📣', earned: stats.total >= 5 },
    { key: 'voiceOfDistrict', emoji: '🏙️', earned: stats.total >= 10 },
    { key: 'solver',          emoji: '✅', earned: stats.resolved >= 1 },
    { key: 'inspector',       emoji: '🔍', earned: stats.categoriesUsed.size >= 3 },
    { key: 'ecologist',       emoji: '🌿', earned: stats.categoriesUsed.has('ecology') },
    { key: 'guardian',        emoji: '🛡️', earned: stats.categoriesUsed.has('safety') },
    { key: 'allRounder',      emoji: '🔧', earned: ALL_CATEGORIES.every((c) => stats.categoriesUsed.has(c)) },
  ], [stats]);

  const earnedCount = badges.filter((b) => b.earned).length;
  const unlockedCards = LANDMARK_CARDS.filter((c) => stats.karma >= c.karmaRequired).length;

  // Max karma for the XP bar (100 karma = full bar, soft cap display)
  const xpPct = Math.min(100, Math.round((stats.karma / 100) * 100));
  const initials = userId ? userId.slice(0, 2).toUpperCase() : '??';

  // Next card to unlock
  const nextCard = LANDMARK_CARDS.find((c) => stats.karma < c.karmaRequired);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.bgLight }}
      contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}
    >
      {/* Avatar + Karma header */}
      <View
        style={{
          backgroundColor: COLORS.brand,
          borderRadius: 20,
          padding: 20,
          alignItems: 'center',
          gap: 10,
        }}
      >
        <View
          style={{
            width: 72, height: 72, borderRadius: 36,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: '800', color: COLORS.white }}>{initials}</Text>
        </View>

        <Text style={{ fontSize: 32, fontWeight: '900', color: COLORS.white }}>
          {stats.karma}
        </Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: -6 }}>
          {t('profile.karma')} · {t('profile.karmaDesc')}
        </Text>

        {/* XP bar */}
        <View style={{ width: '100%', height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
          <View
            style={{
              width: `${xpPct}%`,
              height: '100%',
              backgroundColor: COLORS.white,
              borderRadius: 4,
            }}
          />
        </View>

        {/* Next card unlock hint */}
        {nextCard && (
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>
            {t('collection.nextUnlock', {
              karma: nextCard.karmaRequired - stats.karma,
              name: nextCard.name,
            })}
          </Text>
        )}
      </View>

      {/* Quick stats row */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.brand }}>{stats.total}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.issuesCount')}
          </Text>
        </View>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.success }}>{stats.resolved}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.resolvedCount')}
          </Text>
        </View>
        <View
          style={{
            flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
            padding: 14, alignItems: 'center', gap: 4,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.warning }}>{earnedCount}</Text>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary, textAlign: 'center' }}>
            {t('profile.badges')}
          </Text>
        </View>
      </View>

      {/* Badges section */}
      <View>
        <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 }}>
          {t('profile.badges')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {badges.map((badge) => (
            <View
              key={badge.key}
              style={{
                width: '30.5%',
                backgroundColor: badge.earned ? COLORS.white : COLORS.bgLight,
                borderRadius: 14,
                padding: 12,
                alignItems: 'center',
                gap: 6,
                borderWidth: badge.earned ? 1.5 : 1,
                borderColor: badge.earned ? COLORS.brand : COLORS.border,
                opacity: badge.earned ? 1 : 0.55,
              }}
            >
              <Text style={{ fontSize: 28 }}>{badge.emoji}</Text>
              <Text
                style={{
                  fontSize: 11, fontWeight: '700', textAlign: 'center',
                  color: badge.earned ? COLORS.textPrimary : COLORS.textSecondary,
                }}
                numberOfLines={2}
              >
                {t(`badge.${badge.key}`)}
              </Text>
              <Text
                style={{ fontSize: 9, color: COLORS.textSecondary, textAlign: 'center' }}
                numberOfLines={2}
              >
                {t(`badge.${badge.key}Desc`)}
              </Text>
              {!badge.earned && (
                <Ionicons name="lock-closed" size={12} color={COLORS.gray} />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Landmark Collection */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary }}>
              {t('collection.title')}
            </Text>
            <View
              style={{
                backgroundColor: COLORS.brand,
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                {unlockedCards}/{LANDMARK_CARDS.length}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>
            {t('collection.subtitle')}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8, paddingRight: 4 }}
        >
          {LANDMARK_CARDS.map((card) => (
            <LandmarkCardItem key={card.id} card={card} karma={stats.karma} />
          ))}
        </ScrollView>
      </View>

      {/* Partner Rewards */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="gift-outline" size={20} color={COLORS.brand} />
            <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.textPrimary }}>
              {t('promo.title')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="flash" size={13} color={COLORS.warning} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.warning }}>
              {availableKarma}
            </Text>
            <Text style={{ fontSize: 12, color: COLORS.textSecondary }}>{t('promo.available')}</Text>
          </View>
        </View>

        {loadingOffers ? (
          <ActivityIndicator color={COLORS.brand} style={{ paddingVertical: 24 }} />
        ) : offers.length === 0 ? (
          <Text style={{ color: COLORS.textSecondary, textAlign: 'center', paddingVertical: 16 }}>
            {t('promo.noOffers')}
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingRight: 4 }}
          >
            {offers.map((offer) => {
              const claimed = (offer.redeemedBy ?? []).includes(userId);
              const canAfford = availableKarma >= offer.karmaCost;
              const isClaiming = claiming === offer.id;
              return (
                <View
                  key={offer.id}
                  style={{
                    width: 190,
                    marginRight: 14,
                    backgroundColor: COLORS.white,
                    borderRadius: 18,
                    borderWidth: claimed ? 2 : 1.5,
                    borderColor: claimed ? COLORS.success : canAfford ? COLORS.brand : COLORS.border,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.1,
                    shadowRadius: 6,
                    elevation: 3,
                  }}
                >
                  {/* Header */}
                  <View
                    style={{
                      backgroundColor: claimed ? COLORS.success + '18' : COLORS.brand + '10',
                      padding: 14,
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Text style={{ fontSize: 36 }}>{offer.sponsorIcon}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' }}>
                      {offer.sponsorName}
                    </Text>
                  </View>

                  {/* Body */}
                  <View style={{ padding: 12, gap: 10 }}>
                    <Text style={{ fontSize: 11, color: COLORS.textSecondary, lineHeight: 16 }} numberOfLines={3}>
                      {offer.description}
                    </Text>

                    {/* Karma cost */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="flash" size={14} color={COLORS.warning} />
                      <Text style={{ fontSize: 18, fontWeight: '900', color: COLORS.warning }}>
                        {offer.karmaCost}
                      </Text>
                      <Text style={{ fontSize: 11, color: COLORS.textSecondary }}>karma</Text>
                    </View>

                    {/* Action */}
                    {claimed ? (
                      <View
                        style={{
                          backgroundColor: COLORS.success + '15',
                          borderRadius: 10,
                          padding: 10,
                          gap: 4,
                          borderWidth: 1,
                          borderColor: COLORS.success + '40',
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                          <Text style={{ fontSize: 11, color: COLORS.success, fontWeight: '700' }}>
                            {t('promo.claimed')}
                          </Text>
                        </View>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '900',
                            color: COLORS.textPrimary,
                            letterSpacing: 1.5,
                          }}
                        >
                          {offer.codeValue}
                        </Text>
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => claimOffer(offer)}
                        disabled={!canAfford || isClaiming}
                        style={{
                          backgroundColor: canAfford ? COLORS.brand : COLORS.border,
                          borderRadius: 10,
                          paddingVertical: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: 38,
                        }}
                      >
                        {isClaiming ? (
                          <ActivityIndicator size="small" color={COLORS.white} />
                        ) : canAfford ? (
                          <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 13 }}>
                            {t('promo.spend', { karma: offer.karmaCost })}
                          </Text>
                        ) : (
                          <Text style={{ color: COLORS.white, fontSize: 11, fontWeight: '600', textAlign: 'center', paddingHorizontal: 4 }}>
                            {t('promo.needMore', { need: offer.karmaCost - availableKarma })}
                          </Text>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* My issues link */}
      <Pressable
        onPress={() => router.push('/(tabs)/issues')}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 14,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="warning-outline" size={22} color={COLORS.brand} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.textPrimary }}>
            {t('profile.myIssues')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.brand }}>{stats.total}</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.gray} />
        </View>
      </Pressable>
    </ScrollView>
  );
}
