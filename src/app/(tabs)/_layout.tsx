// mobile/app/(tabs)/_layout.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabNavigationContext } from '../../Components/ui/TabNavigationContext';

const TAB_COUNT = 4;

interface TabItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  focused: boolean;
  badge?: number;
  avatarColor?: string;
  avatarInitials?: string;
}

function TabItem({
  icon,
  label,
  focused,
  badge,
  avatarColor,
  avatarInitials,
}: TabItemProps) {
  return (
    <View style={styles.tabItem}>
      <View style={styles.iconWrapper}>
        {avatarColor && avatarInitials ? (
          <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          </View>
        ) : (
          <MaterialIcons
            name={icon}
            size={24}
            color={focused ? '#1A7A4A' : '#9CA3AF'}
          />
        )}
        {badge !== undefined && badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badge > 99 ? '99+' : String(badge)}
            </Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, focused && styles.labelFocused]}>
        {label}
      </Text>
    </View>
  );
}

// ─── Floating Tab Bar ─────────────────────────────────────────────────────────
function FloatingTabBar({
  state,
  descriptors,
  navigation,
  onTabNavigation, // ✅ receives the setter from parent
}: any) {
  const insets = useSafeAreaInsets();

  // ✅ Keep parent context in sync with actual tab state
  onTabNavigation(state.index, navigation);

  return (
    <View style={[styles.outerWrapper, { bottom: insets.bottom + 12 }]}>
      <View style={styles.barRow}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.75}
              style={[styles.tabBtn, focused && styles.tabBtnFocused]}
            >
              {options.tabBarIcon?.({ focused, color: '', size: 0 })}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Tab Layout ───────────────────────────────────────────────────────────────
export default function TabLayout() {
  const pendingLogs = 0;
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Store the TAB navigator's own navigation object — not the parent's
  const tabNavigationRef = useRef<any>(null);

 const handleTabNavigation = (index: number, navigation: any) => {
  if (tabNavigationRef.current !== navigation) {
    tabNavigationRef.current = navigation;
  }
  // ✅ defer state update so it doesn't fire during render
  if (index !== currentIndex) {
    setTimeout(() => setCurrentIndex(index), 0);
  }
};

  const goToTab = (index: number) => {
    const routes = ['home', 'log', 'insights', 'profile'];
    if (index >= 0 && index < TAB_COUNT && tabNavigationRef.current) {
      // ✅ Use the tab navigator's own navigation.navigate
      tabNavigationRef.current.navigate(routes[index]);
    }
  };

  return (
    <TabNavigationContext.Provider value={{ goToTab, currentIndex }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          lazy: false,
        }}
        tabBar={(props) => (
          <FloatingTabBar
            {...props}
            onTabNavigation={handleTabNavigation}
          />
        )}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabItem icon="home" label="Home" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="log"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabItem
                icon="edit-note"
                label="Log"
                focused={focused}
                badge={pendingLogs}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabItem icon="bar-chart" label="Insights" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabItem
                icon="person"
                label="Profile"
                focused={focused}
                avatarColor="#E8A838"
                avatarInitials="FA"
              />
            ),
          }}
        />
      </Tabs>
    </TabNavigationContext.Provider>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 999,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  barRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 40,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    borderRadius: 30,
  },
  tabBtnFocused: {
    backgroundColor: 'rgba(74, 222, 128, 0.25)',
    shadowColor: '#4ade80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 3,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  labelFocused: {
    color: '#1A7A4A',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -12,
    backgroundColor: '#1A7A4A',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  avatarCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});