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
