import { StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
};

export default function AuthDivider({ label }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  text: {
    color: 'rgba(255,255,255,0.6)',
    marginHorizontal: 12,
    fontSize: 13,
  },
});