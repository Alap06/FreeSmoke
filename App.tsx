import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';

const AppContent = () => {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <AppNavigator />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <AppProvider>
      <AppContent />
    </AppProvider>
  </ThemeProvider>
);

export default App;