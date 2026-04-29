/**
 * This is the main screen for the Tasks feature (home screen) in the Expo app. 
 * It uses the HomeScreen component to display the tasks.
 */
import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tasks',
        }}
      />
      <HomeScreen />
    </>
  )
}
