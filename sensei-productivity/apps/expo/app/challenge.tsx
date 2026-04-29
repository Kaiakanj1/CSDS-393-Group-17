/**
 * This is the main screen for the Challenge feature in the Expo app. 
 * It uses the ChallengeAdminScreen component to display the challenge administration interface.
 */
import { ChallengeAdminScreen } from 'app/features/challenge/challenge-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Challenge',
        }}
      />
      <ChallengeAdminScreen />
    </>
  )
}