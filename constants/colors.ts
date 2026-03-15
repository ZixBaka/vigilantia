export const COLORS = {
  brand: '#2563EB',
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#EF4444',
  gray: '#9CA3AF',
  bgLight: '#F3F4F6',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  white: '#FFFFFF',
  border: '#E5E7EB',
} as const;

export const PIN_COLORS: Record<string, string> = {
  green: COLORS.success,
  yellow: COLORS.warning,
  red: COLORS.danger,
  gray: COLORS.gray,
};
