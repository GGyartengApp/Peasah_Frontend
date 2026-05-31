// mobile/Components/ui/SwipeTabView.tsx
import { useEffect, useRef } from 'react';
import { Dimensions, PanResponder, View } from 'react-native';
import { useTabNavigation } from './TabNavigationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeTabViewProps {
  children: React.ReactNode;
}

export function SwipeTabView({ children }: SwipeTabViewProps) {
  const { goToTab, currentIndex } = useTabNavigation();

  // ✅ Mirror currentIndex into a ref so panResponder always reads latest value
  const currentIndexRef = useRef(currentIndex);
  const goToTabRef      = useRef(goToTab);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    goToTabRef.current = goToTab;
  }, [goToTab]);

  // ✅ panResponder reads from refs — never stale
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) * 2 && Math.abs(dx) > 15;
      },

      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;

        const SWIPE_THRESHOLD    = SCREEN_WIDTH * 0.2;
        const VELOCITY_THRESHOLD = 0.4;

        const isSwipeLeft  = dx < -SWIPE_THRESHOLD || vx < -VELOCITY_THRESHOLD;
        const isSwipeRight = dx >  SWIPE_THRESHOLD || vx >  VELOCITY_THRESHOLD;

        if (isSwipeLeft) {
          goToTabRef.current(currentIndexRef.current + 1);
        } else if (isSwipeRight) {
          goToTabRef.current(currentIndexRef.current - 1);
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}