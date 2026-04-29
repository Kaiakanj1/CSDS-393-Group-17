/**
 * This is the root layout for the Expo app. It sets up the theme, fonts, and navigation structure.
 */
import { useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Tabs } from 'expo-router'
import { Provider } from 'app/provider'
import { NativeToast } from '@my/ui/src/NativeToast'
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { appStorage } from "../../../packages/app/features/lib/storage.js";
import { LoginScreen } from 'app/features/login/login-screen'


export const unstable_settings = {
  // Ensure that reloading on `/user` keeps a back button present.
  initialRouteName: 'Home',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

/**
 * The main App component that initializes fonts, manages the splash screen, and sets up the navigation structure.
 * It also checks for the access token to determine whether to show the login screen or the main app tabs.
 */
export default function App() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (interLoaded || interError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return <RootLayoutNav />;
}

/**
 * The RootLayoutNav component manages the navigation structure of the app. 
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    setAccessToken(appStorage.getString("accessToken"))
  }, []);

  if (accessToken === null) return null;

  return (
    <Provider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />

        {
          accessToken === undefined && <LoginScreen />
        }
        {
          typeof accessToken === "string" && <Tabs screenOptions={{ tabBarActiveTintColor: "teal", tabBarShowLabel: false }}>
            <Tabs.Screen
              name="index"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="home"
                    size={size}
                    color={color} />
                )
              }} />
            <Tabs.Screen name="feed"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={size}
                    color={color} />
                )
              }} />
            <Tabs.Screen name="challenge"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome6
                    name="trophy"
                    size={size}
                    color={color} />
                )
              }} />
            <Tabs.Screen name="profile"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome
                    name="user-circle"
                    size={size}
                    color={color} />
                )
              }} />
          </Tabs>
        }
        <NativeToast />
      </ThemeProvider>
    </Provider>
  )
}
