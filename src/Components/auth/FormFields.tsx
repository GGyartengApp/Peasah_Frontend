import { MaterialIcons } from '@expo/vector-icons';
import AuthInput from './AuthInput';

interface FormFieldProps {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  value: string;
  onChangeText: (val: string) => void;
  valueRef: React.MutableRefObject<string>;
}

export default function FormField({
  label, placeholder, icon, keyboardType,
  secureTextEntry, autoCapitalize, value, onChangeText, valueRef,
}: FormFieldProps) {
  const handleChange = (val: string) => {
    onChangeText(val);
    valueRef.current = val;
  };

  return (
    <AuthInput
      label={label}
      placeholder={placeholder}
      icon={icon}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      value={value}
      onChangeText={handleChange}
    />
  );
}