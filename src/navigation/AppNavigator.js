import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

// Screens
import LoginScreen        from '../screens/LoginScreen';
import OnboardingScreen   from '../screens/OnboardingScreen';
import HomeScreen         from '../screens/HomeScreen';
import JourneyScreen      from '../screens/JourneyScreen';
import AnalyticsScreen    from '../screens/AnalyticsScreen';
import BadgesScreen       from '../screens/BadgesScreen';
import ProfileScreen      from '../screens/ProfileScreen';
import SOSScreen          from '../screens/SOSScreen';
import LogCigaretteScreen from '../screens/LogCigaretteScreen';
import AICoachScreen      from '../screens/AICoachScreen';
import MiniGamesScreen    from '../screens/MiniGamesScreen';
import GameSniper         from '../screens/games/GameSniper';
import GameLung           from '../screens/games/GameLung';
import GameFocus          from '../screens/games/GameFocus';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabIcon = ({ emoji, focused }) => (
  <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
);

const MainTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = {
            Accueil: '🏠', Parcours: '🗺️', Analyses: '📊', Badges: '🏅', Profil: '👤',
          };
          return <TabIcon emoji={icons[route.name]} focused={focused} />;
        },
        tabBarActiveTintColor:   theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor:  theme.border,
          height: 65,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle:      { backgroundColor: theme.card, elevation: 0, shadowOpacity: 0 },
        headerTintColor:  theme.text,
        headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
      })}
    >
      <Tab.Screen name="Accueil"  component={HomeScreen}      options={{ title: '🚭 FreeSmoke' }} />
      <Tab.Screen name="Parcours" component={JourneyScreen}   options={{ title: '🗺️ Mon Parcours' }} />
      <Tab.Screen name="Analyses" component={AnalyticsScreen} options={{ title: '📊 Analyses' }} />
      <Tab.Screen name="Badges"   component={BadgesScreen}    options={{ title: '🏅 Badges' }} />
      <Tab.Screen name="Profil"   component={ProfileScreen}   options={{ title: '👤 Profil' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { theme }                    = useTheme();
  const { onboardingDone, isLoggedIn } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle:     { backgroundColor: theme.card },
        headerTintColor: theme.text,
      }}>
        {!isLoggedIn ? (
          // Pas connecté → Login
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : !onboardingDone ? (
          // Connecté mais pas d'onboarding → Onboarding
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Connecté + onboarding fait → App principale
          <>
            <Stack.Screen name="Main"          component={MainTabs}           options={{ headerShown: false }} />
            <Stack.Screen name="SOS"           component={SOSScreen}          options={{ title: '🆘 SOS Envie', presentation: 'modal' }} />
            <Stack.Screen name="LogCigarette"  component={LogCigaretteScreen} options={{ title: '🚬 Journal', presentation: 'modal' }} />
            <Stack.Screen name="AICoach"       component={AICoachScreen}      options={{ headerShown: false }} />
            <Stack.Screen name="MiniGames"     component={MiniGamesScreen}    options={{ title: '🎮 Mini-Jeux' }} />
            <Stack.Screen name="GameSniper"    component={GameSniper}         options={{ headerShown: false }} />
            <Stack.Screen name="GameLung"      component={GameLung}           options={{ headerShown: false }} />
            <Stack.Screen name="GameFocus"     component={GameFocus}          options={{ headerShown: false }} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: '🔔 Notifications' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;