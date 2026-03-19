'use client'

import { useState } from 'react'
import {
  Avatar,
  Button,
  H1,
  H3,
  Paragraph,
  ScrollView,
  Separator,
  XStack,
  YStack,
} from '@my/ui'
import { ToastAndroid} from 'react-native'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { Heart } from '@tamagui/lucide-icons'
import { Theme } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { SenseiProductivity } from "@aurora-interactive/sensei-productivity";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


type Profile = {
  userName: string
  name: string
  school: string
  userClass: number
}
type FeedPost = {
  id: number
  user: string
  handle: string
  category: 'School' | 'Work' | 'Wellness'
  title: string
  body: string
  likes: number
  time: string
}

const mockProfile: Profile = {
  userName: 'mayac',
  name: 'Maya Chen',
  school: 'University of California, Berkeley',
  userClass: 128
}

const mockPosts: FeedPost[] = [
  {
    id: 1,
    user: 'Maya Chen',
    handle: '@mayac',
    category: 'School',
    title: 'Locked in for midterms',
    body: 'Finished my study plan for the week and split everything into 45-minute blocks. Actually feeling organized for once.',
    likes: 18,
    time: '2h ago',
  },
  {
    id: 2,
    user: 'Maya Chen',
    handle: '@mayac',
    category: 'Work',
    title: 'Big productivity win today',
    body: 'Finally wrapped up the internship application tracker and cleaned up my resume tasks. Tiny systems really do help.',
    likes: 27,
    time: '4h ago',
  },
  {
    id: 3,
    user: 'Maya Chen',
    handle: '@mayac',
    category: 'Wellness',
    title: 'Reminder to take care of yourself too',
    body: 'I got outside for a walk before starting homework and it made a huge difference. Romanticizing basic self-care is working.',
    likes: 35,
    time: '6h ago',
  },
]

const categoryStyles = {
  School: {
    bg: '#EC417A',
    icon: <Ionicons name="school" size={20} color="white" />,
  },
  Work: {
    bg: '#54B41D',
    icon: <MaterialIcons name="work" size={20} color="white" />,
  },
  Wellness: {
    bg: '#886BEF',
    icon: <MaterialCommunityIcons name="head-heart" size={20} color="white" />,
  },
}


export function ProfileScreen() {
  const senseiProductivity = new SenseiProductivity({})
  const posts = mockPosts
  const profile = mockProfile
  const [canClick, setCanClick] = useState<true | false>(true)
  const userAction = {0: "Add Friend", 64: "Remove From School", 128: "Ban User"}
  const afterAction = {0: "Friend Request Pending", 64: "User Removed from School", 128: "User Banned"}
  const actionToast = {0: "Friend request sent!", 64: "User removed from school!", 128: "User banned from app!"}
  const actionIcon = {0: <FontAwesome5 name="user-plus" size={24} color="white" />,
                      64: <FontAwesome6 name="user-xmark" size={24} color="white" />,
                      128: <FontAwesome6 name="school-circle-xmark" size={24} color="white" />}
  function handleAction() {
    if (canClick) {
      ToastAndroid.show("@" + profile.userName + ": " + actionToast[profile.userClass], ToastAndroid.SHORT)
      console.log("@" + profile.userName + ": " + actionToast[profile.userClass])
    }
    setCanClick(!canClick)
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#404040' }}>
        <YStack flex={1}>
          <YStack p="$4" gap="$4">
            <XStack items="center" justify="space-between">
              <XStack items="center" gap="$3">
                  <Avatar circular size="$8">
                    <Avatar.Image
                      src={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                        profile.name
                      )}`}
                    />
                    <Avatar.Fallback bg="#DDD" />
                  </Avatar>
                  <YStack p="$2">
                    <H1 size="$9" color="white">{profile.name}</H1>
                    <XStack gap="$1">
                      <Ionicons name="at-outline" size={24} color="white" />
                      <Paragraph color="white">{profile.userName}</Paragraph>
                    </XStack>
                    <XStack gap="$2">
                      <Ionicons name="school" size={20} color="white" />
                      <Paragraph color="white">{profile.school}</Paragraph>
                    </XStack>
                  </YStack>
                </XStack>
            </XStack>
            <Button
            bg={canClick ? "#EC417A" : "#888"}
            color="white"
            size="$4"
            disabled={false}
            icon={actionIcon[profile.userClass]}
            onPress={() => { handleAction()}}>
              {canClick ? userAction[profile.userClass] : afterAction[profile.userClass]}
            </Button>
          </YStack>

          <YStack
            flex={1}
            bg="white"
            borderTopLeftRadius={24}
            borderTopRightRadius={24}
            overflow="hidden"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <YStack p="$4" gap="$4">
                <Paragraph p="$2" fontWeight="700">Posts by {profile.name}</Paragraph>
                {posts.map((post) => (
                  <FeedCard key={post.id} post={post} />
                ))}
              </YStack>
            </ScrollView>
          </YStack>
        </YStack>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

function FeedCard({ post }: { post: FeedPost }) {
  const category = categoryStyles[post.category]

  return (
    <Theme>
      <YStack
        bg="white"
        borderWidth={1}
        borderColor="#EAEAEA"
        borderRadius={18}
        overflow="hidden"
        shadowColor="$shadowColor"
        shadowOpacity={0.08}
        shadowRadius={10}
      >
        <YStack p="$4" gap="$3">
          <XStack items="center" gap="$3">
            <Avatar circular size="$4">
              <Avatar.Image
                src={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                  post.user
                )}`}
              />
              <Avatar.Fallback bg="#DDD" />
            </Avatar>

            <YStack>
              <Paragraph fontWeight="700">{post.user}</Paragraph>
              <Paragraph color="#1A1A1A">{post.handle}</Paragraph>
            </YStack>
          </XStack>

          <YStack gap="$2">
            <H3 size="$6">{post.title}</H3>
            <Paragraph color="#1C1C1C">{post.body}</Paragraph>
          </YStack>

          <Separator />

          <XStack justify="space-between" items="center">
            <XStack gap="$4">
              <ActionButton icon={<Heart size={18} />} text={post.likes} />
            </XStack>

          </XStack>
        </YStack>
      </YStack>
    </Theme>
  )
}

function ActionButton({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: number
}) {
  return (
    <XStack gap="$2" items="center">
      {icon}
      <Paragraph>{text}</Paragraph>
    </XStack>
  )
}