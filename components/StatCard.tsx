import { View, Text } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  label: string;
  value: string | number;
  color?: string;
  unit?: string;
}

export default function StatCard({ label, value, color = COLORS.brand, unit }: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: '800', color }}>{value}</Text>
      {unit && (
        <Text style={{ fontSize: 14, color, fontWeight: '600', marginTop: -2 }}>{unit}</Text>
      )}
      <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}
