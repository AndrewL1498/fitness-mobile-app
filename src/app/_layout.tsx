import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import React from 'react';
import { useColorScheme, View } from 'react-native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { ThemeProvider } from '@/context/ThemeContext';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider>
      <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, backgroundColor: '#121212' }}>
          <AnimatedSplashOverlay />
          <AppTabs />
        </View>
      </NavThemeProvider>
    </ThemeProvider>
  );
}