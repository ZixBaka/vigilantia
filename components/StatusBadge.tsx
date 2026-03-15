import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ReportStatus, SchoolPinColor } from '../types';
import { COLORS } from '../constants/colors';

interface Props {
  status: ReportStatus | SchoolPinColor | null;
  size?: 'sm' | 'md';
}

const CONFIG: Record<string, { bg: string; text: string; labelKey: string }> = {
  done: { bg: '#DCFCE7', text: COLORS.success, labelKey: 'status.done' },
  green: { bg: '#DCFCE7', text: COLORS.success, labelKey: 'status.done' },
  problem: { bg: '#FEE2E2', text: COLORS.danger, labelKey: 'status.problem' },
  red: { bg: '#FEE2E2', text: COLORS.danger, labelKey: 'status.problem' },
  yellow: { bg: '#FEF9C3', text: COLORS.warning, labelKey: 'status.noReports' },
  gray: { bg: COLORS.bgLight, text: COLORS.gray, labelKey: 'status.noReports' },
};

export default function StatusBadge({ status, size = 'md' }: Props) {
  const { t } = useTranslation();
  if (!status) return null;

  const cfg = CONFIG[status] ?? CONFIG.gray;
  const pad = size === 'sm' ? { paddingHorizontal: 6, paddingVertical: 2 } : { paddingHorizontal: 10, paddingVertical: 4 };
  const fontSize = size === 'sm' ? 11 : 13;

  return (
    <View style={{ backgroundColor: cfg.bg, borderRadius: 20, ...pad, alignSelf: 'flex-start' }}>
      <Text style={{ color: cfg.text, fontWeight: '600', fontSize }}>{t(cfg.labelKey)}</Text>
    </View>
  );
}
