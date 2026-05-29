import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthBackground from '../../Components/auth/AuthBackground';
import AuthButton from '../../Components/auth/AuthButton';
import AuthCard from '../../Components/auth/AuthCard';
import AuthHero from '../../Components/auth/AuthHero';
import AuthInput from '../../Components/auth/AuthInput';
import { COLORS } from '../../Constants/Theme';

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <AuthBackground overlayHeight={0.4}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHero size="small" tagline="Create Your Farm Account" />

          <AuthCard title="Get Started" subtitle="Join thousands of farmers managing their farms">
            <AuthInput label="Full Name" placeholder="Your full name" value={name} onChangeText={setName} icon="person" autoCapitalize="words" />
            <AuthInput label="Email Address" placeholder="farmer@example.com" value={email} onChangeText={setEmail} icon="email" keyboardType="email-address" />
            <AuthInput label="Phone (Optional)" placeholder="+233 XX XXX XXXX" value={phone} onChangeText={setPhone} icon="phone" keyboardType="phone-pad" />
            <AuthInput label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} icon="lock" secureTextEntry />
            <AuthInput label="Confirm Password" placeholder="••••••••" value={confirmPassword} onChangeText={setConfirmPassword} icon="lock-outline" secureTextEntry />

            <AuthButton label="Create Account" onPress={handleSignUp} loading={isLoading} icon="person-add" />

            <View style={styles.loginLink}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginBtn}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </AuthCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24 },
  loginLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
  loginBtn: { fontSize: 14, color: COLORS.accent, fontWeight: '600' },
});