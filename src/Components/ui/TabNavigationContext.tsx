// mobile/Components/ui/TabNavigationContext.tsx
import { createContext, useContext } from 'react';

interface TabNavigationContextType {
  goToTab: (index: number) => void;
  currentIndex: number;
}

export const TabNavigationContext = createContext<TabNavigationContextType>({
  goToTab: () => {},
  currentIndex: 0,
});

export const useTabNavigation = () => useContext(TabNavigationContext);