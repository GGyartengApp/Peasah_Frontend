import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthBackground from '../../Components/auth/AuthBackground';
import AuthButton from '../../Components/auth/AuthButton';
import AuthCard from '../../Components/auth/AuthCard';
import AuthDivider from '../../Components/auth/AuthDivider';
import AuthHero from '../../Components/auth/AuthHero';
import AuthInput from '../../Components/auth/AuthInput';
import { COLORS } from '../../Constants/Theme';

const FEATURE_TAGS = [
  { label: 'Tasks' },
  { label: 'Crops' },
  { label: 'Fields' },
] as const;

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 1200);
  };

  return (
    <AuthBackground>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero size="large" />

          <AuthCard title="Welcome Back" subtitle="Sign in to manage your farm">
            <AuthInput
              label="Email Address"
              placeholder="farmer@example.com"
              value={email}
              onChangeText={setEmail}
              icon="email"
              keyboardType="email-address"
            />
            <AuthInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock"
              secureTextEntry
            />
            <AuthButton label="Sign In to Your Farm" onPress={handleLogin} loading={isLoading} icon="login" />
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </AuthCard>

          <AuthDivider label="New to Peasah?" />

          <AuthButton
            label="Create a Farm Account"
            onPress={() => router.push('/(authentication)/Signup')}
            variant="outline"
          />

          {/* Feature tags */}
          <View style={styles.tags}>
            {FEATURE_TAGS.map((f) => (
              <View key={f.label} style={styles.tag}>
                <Text style={styles.tagText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  forgotBtn: { alignItems: 'center', paddingVertical: 8 },
  forgotText: { fontSize: 14, color: COLORS.accent, fontWeight: '500' },
  tags: { flexDirection: 'row', justifyContent: 'center', marginTop: 32, gap: 8 },
  tag: {
    backgroundColor: 'rgba(44, 80, 22, 0.6)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(122,182,72,0.35)',
  },
  tagText: { fontSize: 12, color: 'rgba(212,230,181,0.9)', fontWeight: '500' },
});