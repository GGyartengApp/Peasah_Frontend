import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { COLORS } from '../../Constants/Theme';

const DEFAULT_HEIGHT = 54;
const DEFAULT_THUMB_SIZE = DEFAULT_HEIGHT - 6;

interface SwipeButtonProps {
  label?: string;
  onSwipeComplete: () => boolean | Promise<boolean>;
  trackColor?: string;
  accentColor?: string;
  width?: number;
  height?: number;
  glowColor?: string;
  isValid?: boolean;
}

function AnimatedCaret({ delay, color }: { delay: number; color: string }) {
  const opacity = useRef(new Animated.Value(0.15)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 6, duration: 400, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.15, duration: 400, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: 400, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <MaterialIcons name="chevron-right" size={22} color={color} />
    </Animated.View>
  );
}

export default function SwipeButton({
  label = 'Swipe to Continue',
  onSwipeComplete,
  trackColor = '#D1D5DB',
  accentColor = COLORS.accent,
  width = 260,
  height = DEFAULT_HEIGHT,
  glowColor = '#4ade80',
  isValid = false,
}: SwipeButtonProps) {
  const THUMB_SIZE = height - 6;
  const MAX_SWIPE = width - THUMB_SIZE - 4;

  const translateX = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const validAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;

  const [isLoading, setIsLoading] = useState(false);
  const [swiped, setSwiped] = useState(false);

  const isLoadingRef = useRef(false);
  const swipedRef = useRef(false);

  const setLoadingState = (val: boolean) => { setIsLoading(val); isLoadingRef.current = val; };
  const setSwipedState = (val: boolean) => { setSwiped(val); swipedRef.current = val; };

  // Animate track to green when all fields valid
  useEffect(() => {
    Animated.timing(validAnim, {
      toValue: isValid ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isValid]);

  // Pulsing glow loop
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1200, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  const resetSwipe = () => {
    setSwipedState(false);
    Animated.parallel([
      Animated.spring(translateX, { toValue: 0, useNativeDriver: false }),
      Animated.timing(progressAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLoadingRef.current && !swipedRef.current,
      onMoveShouldSetPanResponder: () => !isLoadingRef.current && !swipedRef.current,
      onPanResponderMove: (_, g) => {
        const dx = Math.max(0, Math.min(g.dx, MAX_SWIPE));
        translateX.setValue(dx);
        progressAnim.setValue(dx / MAX_SWIPE);
      },
      onPanResponderRelease: async (_, g) => {
        if (g.dx >= MAX_SWIPE * 0.85) {
          Animated.parallel([
            Animated.spring(translateX, { toValue: MAX_SWIPE, useNativeDriver: false }),
            Animated.timing(progressAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
          ]).start(async () => {
            const valid = await onSwipeComplete();
            if (valid) {
              setSwipedState(true);
              setLoadingState(true);
            } else {
              resetSwipe();
            }
          });
        } else {
          resetSwipe();
        }
      },
    })
  ).current;

  // Grey → green when valid
  const idleTrackColor = validAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [trackColor, COLORS.primary],
  });

  // Transparent → accent while swiping
  const animatedTrackColor = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', accentColor],
  });

  // Label fades out as thumb moves
  const labelOpacity = progressAnim.interpolate({
    inputRange: [0, 0.3],
    outputRange: [1, 0],
  });

  return (
    <View style={[styles.outerWrapper, { width: width + 24 }]}>

      {/* Pulsing glow ring */}
      <Animated.View
        style={[
          styles.glow,
          {
            width,
            height,
            borderRadius: height / 2,
            opacity: glowAnim,
            borderColor: glowColor,
            shadowColor: glowColor,
          },
        ]}
      />

      {/* Track base */}
      <Animated.View style={[
        styles.track,
        { backgroundColor: idleTrackColor, width, height, borderRadius: height / 2 },
      ]}>

        {/* Swipe progress color overlay */}
        <Animated.View style={[
          StyleSheet.absoluteFill,
          { backgroundColor: animatedTrackColor, borderRadius: height / 2 },
        ]} />

        {/* ✅ Clipped carets — width grows with translateX so they only show behind the thumb */}
        <Animated.View style={[
          styles.caretsClip,
          {
            width: translateX,  // ✅ 0 at idle, grows as thumb moves right
            height,
          },
        ]}>
          <View style={[styles.caretsContainer, { height, width: MAX_SWIPE }]}>
            <AnimatedCaret delay={0}   color="#fff" />
            <AnimatedCaret delay={80}  color="#fff" />
            <AnimatedCaret delay={240} color="#fff" />
            <AnimatedCaret delay={400} color="#fff" />
            <AnimatedCaret delay={480} color="#fff" />
            <AnimatedCaret delay={560} color="#fff" />
            <AnimatedCaret delay={640} color="#fff" />
            <AnimatedCaret delay={720} color="#fff" />
          </View>
        </Animated.View>

        {/* Label — fades out when swiping starts */}
        <Animated.Text style={[styles.label, { opacity: labelOpacity, paddingLeft: THUMB_SIZE }]}>
          {swiped ? 'Done!' : label}
        </Animated.Text>

        {/* Thumb — slides right, sits on top of everything */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              transform: [{ translateX }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {isLoading ? (
            <MaterialIcons name="hourglass-top" size={22} color={accentColor} />
          ) : swiped ? (
            <MaterialIcons name="check-circle" size={22} color={accentColor} />
          ) : (
            <MaterialIcons name="chevron-right" size={22} color={accentColor} />
          )}
        </Animated.View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 6,
  },
  glow: {
    position: 'absolute',
    alignSelf: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 6,
  },
  track: {
    justifyContent: 'center',
    paddingLeft: 2,
    overflow: 'hidden',
  },
  caretsClip: {
    position: 'absolute',
    left: 2,
    overflow: 'hidden', // ✅ clips carets to only the revealed area
    zIndex: 0,
  },
  caretsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
  },
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  thumb: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 2,
  },
});