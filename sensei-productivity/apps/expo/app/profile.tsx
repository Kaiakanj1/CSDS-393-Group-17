import { LoginScreen } from 'app/features/login/login-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
        }}
      />
      <LoginScreen />
    </>
  )
}
