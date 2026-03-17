import { Stack } from 'expo-router'
import { SocialFeedScreen } from "app/features/feed/social-feed"

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Social Activity Feed',
        }}
      />
      <SocialFeedScreen />
    </>
  )
}
