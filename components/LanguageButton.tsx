import { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAppStore } from '../lib/store';

const LANGS = [
  { code: 'ru', label: 'Рус' },
  { code: 'uz', label: "O'zb" },
  { code: 'en', label: 'Eng' },
];

export default function LanguageButton() {
  const { i18n, t } = useTranslation();
  const setLanguage = useAppStore((s) => s.setLanguage);
  const [visible, setVisible] = useState(false);

  const switchLang = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
    setVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', gap: 4 }}
      >
        <Ionicons name="language-outline" size={20} color={COLORS.brand} />
        <Text style={{ color: COLORS.brand, fontWeight: '600', fontSize: 13 }}>
          {i18n.language.toUpperCase()}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setVisible(false)}
        >
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 8, minWidth: 160 }}>
            {LANGS.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => switchLang(lang.code)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  backgroundColor: i18n.language === lang.code ? COLORS.bgLight : 'transparent',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                {i18n.language === lang.code && (
                  <Ionicons name="checkmark" size={16} color={COLORS.brand} />
                )}
                <Text style={{ fontSize: 16, color: COLORS.textPrimary, marginLeft: i18n.language === lang.code ? 0 : 26 }}>
                  {t(`lang.${lang.code}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
