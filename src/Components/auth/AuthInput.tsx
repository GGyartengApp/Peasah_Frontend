import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../Constants/Theme';

type Props = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  secureTextEntry?: boolean;
   keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric'; // ✅ expanded
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; 
};

export default function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: Props) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        focused && styles.inputFocused
      ]}>
        <MaterialIcons
          name={icon}
          size={20}
          color={focused ? COLORS.accent : COLORS.textSecondary}
          style={styles.icon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            { paddingVertical: Platform.OS === 'ios' ? 0 : 14 }
          ]}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(p => !p)}
            style={styles.eyeButton}
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 0,
  },
  inputFocused: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.inputFocusBg,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  eyeButton: {
    padding: 4,
  },
});