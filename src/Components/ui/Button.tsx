import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], isDisabled && styles.disabled]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.label, variant === 'secondary' && styles.labelSecondary]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary:        { backgroundColor: '#1A7A4A' },
  secondary:      { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#1A7A4A' },
  danger:         { backgroundColor: '#C62828' },
  disabled:       { opacity: 0.5 },
  label:          { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  labelSecondary: { color: '#1A7A4A' },
});