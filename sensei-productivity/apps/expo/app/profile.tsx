/**
 * This is the main screen for the user Profile feature in the Expo app. 
 * It uses the ProfileScreen component to display the user's profile information.
 */
import { ProfileScreen } from 'app/features/profile/profile-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
        }}
      />
      <ProfileScreen />
    </>
  )
}
