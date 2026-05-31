import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../Constants/Theme";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    title: "Welcome to Peasah",
    description: "Your smart farming companion built to help you grow, track, and understand agriculture in a simpler way.",
    tagLine: "Let's grow smarter together.",
    image: require("../../../assets/Img/Welcome.png"),
    accent: "#4ade80",
  },
  {
    id: 2,
    title: "Everything you need in one place ",
    description: "Peasah helps you manage crops, get insights, and make better farming decisions using simple tools designed for real-world impact.",
    tagLine: "From soil to success",
    image: require("../../../assets/Img/Farmhouse.png"),
    accent: "#3ee57b",
  },
  {
    id: 3,
    title: "Know your farm better ",
    description: "Get helpful insights about weather, crops, and growth patterns so you can make confident decisions.",
    tagLine: "Data that grows with you.",
    image: require("../../../assets/Img/Rancher-.png"),
    accent: "#22c55e",
  },
  {
    id: 4,
    title: "Track your progress ",
    description: "Keep a record of your planting, growth stages, and harvests—all organized in one clean dashboard.",
    tagLine: "Every step, recorded.",
    image: require("../../../assets/Img/Completed.png"),
    accent: "#16a34a",
  },
  {
    id: 5,
    title: "Ready to grow? ",
    description: "Let's begin your journey with Peasah and turn simple farming into smart farming.",
    tagLine: "",
    image: require("../../../assets/Img/letsgo.png"),
    accent: "#166534",
  },
];

// Animated slide item
function SlideItem({ item, index, scrollX }: { item: typeof slides[0]; index: number; scrollX: Animated.Value }) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Image floats up/down
  const imageTranslateY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(imageTranslateY, { toValue: -12, duration: 2000, useNativeDriver: true }),
        Animated.timing(imageTranslateY, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Slide in from right, fade in
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [width * 0.3, 0, -width * 0.3],
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  });

  // Title slides up
  const titleTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, -40],
  });

  // Description slides up with delay feel
  const descTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [60, 0, -60],
  });

  // Tagline
  const tagTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [80, 0, -80],
  });

  return (
    <View style={[styles.slide, { width }]}>
      {/* Animated image with float */}
      <Animated.View style={[styles.imageWrapper, { transform: [{ translateX }, { translateY: imageTranslateY }], opacity }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </Animated.View>

      {/* Text block */}
      <Animated.View style={[styles.textBlock, { opacity }]}>
        <Animated.Text style={[styles.title, { transform: [{ translateY: titleTranslateY }] }]}>
          {item.title}
        </Animated.Text>

        <Animated.Text style={[styles.description, { transform: [{ translateY: descTranslateY }] }]}>
          {item.description}
        </Animated.Text>

        {item.tagLine ? (
          <Animated.Text style={[styles.tagLine, { color: item.accent, transform: [{ translateY: tagTranslateY }] }]}>
            "{item.tagLine}"
          </Animated.Text>
        ) : null}
      </Animated.View>
    </View>
  );
}

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Background color animates between slide accents
  const backgroundColor = scrollX.interpolate({
    inputRange: slides.map((_, i) => i * width),
    outputRange: slides.map(s => s.accent + '22'), // light tint
  });

  // Dot indicator width animates
  const handleDone = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(authentication)/Signup");
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleDone();
    }
  };

  // Button fade in
  const buttonAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(buttonAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const isLast = currentIndex === slides.length - 1;

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Skip button */}
      {!isLast && (
        <Animated.View style={[styles.skipWrapper, { top: insets.top + 12, opacity: buttonAnim }]}>
          <TouchableOpacity onPress={handleDone}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={item => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item, index }) => (
          <SlideItem item={item} index={index} scrollX={scrollX} />
        )}
      />

      {/* Bottom controls */}
      <Animated.View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16, opacity: buttonAnim }]}>

 {/* Dot indicators — no Animated width, uses currentIndex state instead */}
<View style={styles.dotsRow}>
  {slides.map((_, i) => (
    <View
      key={i}
      style={[
        styles.dot,
        {
          width: i === currentIndex ? 28 : 8,
          opacity: i === currentIndex ? 1 : 0.3,
          backgroundColor: slides[currentIndex].accent,
        },
      ]}
    />
  ))}
</View>

        {/* Next / Done button */}
        <TouchableOpacity
          onPress={goNext}
          style={[styles.nextButton, { backgroundColor: slides[currentIndex].accent }]}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>{isLast ? "Get Started 🚀" : "Next →"}</Text>
        </TouchableOpacity>

      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipWrapper: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 80,
  },
  imageWrapper: {
    width: width - 80,
    height: height * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  tagLine: {
    fontSize: SIZES.h6,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 28,
    paddingTop: 12,
    alignItems: 'center',
    gap: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    width: width - 56,
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
});