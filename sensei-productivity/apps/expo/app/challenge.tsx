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