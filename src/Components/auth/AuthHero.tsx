import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, SIZES } from '../../Constants/Theme';

type Props = {
  tagline?: string;
  size?: 'large' | 'small'; // large for Login, small for SignUp
};

export default function AuthHero({
  tagline = 'Farm Management Platform',
  size = 'large',
}: Props) {
  const isLarge = size === 'large';

  return (
    <View style={[styles.container, isLarge ? styles.largeMargin : styles.smallMargin]}>
      <View style={[styles.logoCircle, !isLarge && styles.logoCircleSmall]}>
        <Image
          source={require('../../../assets/Img/Logo_Splash.png')}
          style={{ width: isLarge ? 44 : 38, height: isLarge ? 44 : 38 }}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.appName, !isLarge && styles.appNameSmall]}>PEASAH</Text>
      <Text style={styles.tagline}>{tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  largeMargin: {
    marginTop: 32,
    marginBottom: 48,
  },
  smallMargin: {
    marginBottom: 32,
  },
  logoCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoCircleSmall: {
    width: 70, height: 70,
    borderRadius: 35,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 6,
  },
  appNameSmall: {
    fontSize: 36,
    letterSpacing: 3,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(212, 230, 181, 0.92)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});