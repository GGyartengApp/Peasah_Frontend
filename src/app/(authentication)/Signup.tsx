import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthBackground from '../../Components/auth/AuthBackground';
import AuthCard from '../../Components/auth/AuthCard';
import AuthHero from '../../Components/auth/AuthHero';
import AuthInput from '../../Components/auth/AuthInput';
import SwipeButton from '../../Components/auth/SwipeButton';
import { useFormField } from '../../hooks/useFormFields';
import { COLORS } from '../../Constants/Theme';

export default function SignUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const name = useFormField();
  const email = useFormField();
  const phone = useFormField();
  const password = useFormField();
  const confirmPassword = useFormField();

  // ✅ Compute validity from state values (for UI feedback)
  const allValid =
    name.value.trim().length > 0 &&
    email.value.trim().length > 0 &&
    password.value.trim().length >= 6 &&
    confirmPassword.value.trim().length > 0 &&
    password.value === confirmPassword.value;

  const validate = (): boolean => {
    if (!name.ref.current.trim() || !email.ref.current.trim() || !password.ref.current.trim() || !confirmPassword.ref.current.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return false;
    }
    if (password.ref.current !== confirmPassword.ref.current) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return false;
    }
    if (password.ref.current.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSwipeComplete = async (): Promise<boolean> => {
    const valid = validate();
    if (valid) {
      await new Promise(res => setTimeout(res, 1500));
      router.replace('/(tabs)/home');
    }
    return valid;
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
            <AuthInput label="Full Name" placeholder="Your full name" value={name.value} onChangeText={name.set} icon="person" autoCapitalize="words" />
            <AuthInput label="Email Address" placeholder="farmer@example.com" value={email.value} onChangeText={email.set} icon="email" keyboardType="email-address" />
            <AuthInput label="Phone (Optional)" placeholder="+233 XX XXX XXXX" value={phone.value} onChangeText={phone.set} icon="phone" keyboardType="phone-pad" />
            <AuthInput label="Password" placeholder="••••••••" value={password.value} onChangeText={password.set} icon="lock" secureTextEntry />
            <AuthInput label="Confirm Password" placeholder="••••••••" value={confirmPassword.value} onChangeText={confirmPassword.set} icon="lock-outline" secureTextEntry />

            {/* ✅ Pass allValid so SwipeButton can change track color */}
            <SwipeButton
              label="Swipe to Register"
              onSwipeComplete={handleSwipeComplete}
              width={260}
              height={54}
              isValid={allValid}
            />

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
  loginLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  loginText: { fontSize: 14, color: COLORS.textSecondary },
  loginBtn: { fontSize: 14, color: COLORS.accent, fontWeight: '600' },
});