/**
 * This is the main screen for the social Feed feature in the Expo app. 
 * It uses the FeedScreen component to display the feed content.
 */
import { FeedScreen } from 'app/features/feed/feed-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Feed',
        }}
      />
      <FeedScreen />
    </>
  )
}
