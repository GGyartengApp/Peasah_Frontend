import { COLORS, SIZES } from "../../Constants/Theme";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    id: 1,
    title: "Welcome to Peasah",
    desription:
      "Your smart farming companion built to help you grow, track, and understand agriculture in a simpler way.",
    tagLine: "Let’s grow smarter together.",
    image: require("../../../assets/Img/Welcome.png"),
  },
  {
    id: 2,
    title: "Everything you need in one place 📊",
    desription:
      "Peasah helps you manage crops, get insights, and make better farming decisions using simple tools designed for real-world impact",
    tagLine: "From soil to success",
    image: require("../../../assets/Img/Onboarding_agric_appointment_wb.png"),
  },
  {
    id: 3,
    title: "Know your farm better 🌾",
    desription:
      "Get helpful insights about weather, crops, and growth patterns so you can make confident decisions.",
    tagLine: "Data that grows with you.",
    image: require("../../../assets/Img/progress-indicator.png"),
  },
  {
    id: 4,
    title: "Track your progress 📍",
    desription:
      "Keep a record of your planting, growth stages, and harvests—all organized in one clean dashboard.",
    tagLine: "Every step, recorded.",
    image: require("../../../assets/Img/progress-indicator.png"),
  },
  {
    id: 5,
    title: "Learn from others 🤝",
    desription:
      "Connect with other farmers, share experiences, and discover better farming techniques.",
    tagLine: "Grow together, not alone.",
    image: require("../../../assets/Img/progress-indicator.png"),
  },
  {
    id: 6,
    title: "Ready to grow? 🚀",
    desription:
      "Let’s begin your journey with Peasah and turn simple farming into smart farming.",
    tagLine: "",
    image: require("../../../assets/Img/progress-indicator.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();

  const handleDone = async () => {
    await AsyncStorage.setItem('hasOnboarded', 'true');
    router.replace('/(authentication)/Signup');
  };

  const buttonLabel = (label: string) => (
    <View style={{ padding: 12 }}>
      <Text style={{ color: COLORS.textPrimary, fontWeight: "600", fontSize: SIZES.h4 }}>
        {label}
      </Text>
    </View>
  );

  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item }) => (
        <View style={{ flex: 1, alignItems: "center", padding: 15, paddingTop: 100 }}>
          <Image
            source={item.image}
            style={{ width: SIZES.width - 80, height: 400 }}
            resizeMode="contain"
          />
          <Text style={{ fontWeight: "bold", color: COLORS.textPrimary, fontSize: SIZES.h2 }}>
            {item.title}
          </Text>
          <Text style={{ textAlign: "center", paddingTop: 5, color: COLORS.primary }}>
            {item.desription}
          </Text>
          <Text style={{ textAlign: "center", paddingTop: 5, fontSize: SIZES.h6, fontStyle: "italic", color: COLORS.primary }}>
            {item.tagLine}
          </Text>
        </View>
      )}
      activeDotStyle={{ backgroundColor: COLORS.primary, width: 30 }}
      showSkipButton
      renderNextButton={() => buttonLabel("Next")}
      renderSkipButton={() => buttonLabel("Skip")}
      renderDoneButton={() => buttonLabel("Done")}
      onDone={handleDone}
      onSkip={handleDone}  // ← skip also marks onboarding complete
    />
  );
}