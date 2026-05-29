import { MaterialIcons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../Constants/Theme';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'primary' | 'outline';
};

export default function AuthButton({
  label,
  onPress,
  loading = false,
  icon,
  variant = 'primary',
}: Props) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[styles.button, isPrimary ? styles.primary : styles.outline]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <View style={styles.row}>
          {icon && (
            <MaterialIcons
              name={icon}
              size={20}
              color={isPrimary ? '#fff' : COLORS.border}
              style={styles.icon}
            />
          )}
          <Text style={[styles.label, !isPrimary && styles.outlineLabel]}>
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  outline: {
    borderWidth: 2,
    borderColor: 'rgba(122, 182, 72, 0.8)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  outlineLabel: {
    color: COLORS.border,
    fontSize: 15,
  },
});