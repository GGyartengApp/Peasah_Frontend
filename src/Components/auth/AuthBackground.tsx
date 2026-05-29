import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function AuthBackground({ children }: Props) {
  return (
    <ImageBackground
      source={require('../../../assets/Img/Login/Bg.jpg')}
      style={styles.root}
      resizeMode="cover"
    >
      <LinearGradient
        colors={[
          'transparent',           // top — image shows fully
          'rgba(20, 45, 8, 0.4)',  // middle — slight tint
          'rgba(20, 45, 8, 0.85)', // lower — getting dark
          'rgba(20, 45, 8, 0.97)', // bottom — almost solid
        ]}
        locations={[0, 0.35, 0.65, 1]}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});