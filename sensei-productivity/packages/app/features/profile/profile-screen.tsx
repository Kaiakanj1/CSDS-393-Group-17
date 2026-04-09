'use client'

import { useEffect, useState } from 'react'
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
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { Heart } from '@tamagui/lucide-icons'
import { Theme } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Alert } from 'react-native'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'
import { appStorage } from '../lib/storage.js'

type Profile = {
  userId: number
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
} as const

function mapCategory(categoryName: string): 'School' | 'Work' | 'Wellness' {
  const lower = categoryName?.toLowerCase?.() ?? ''

  if (lower.includes('school') || lower.includes('academic')) return 'School'
  if (lower.includes('work')) return 'Work'
  if (lower.includes('well') || lower.includes('health') || lower.includes('personal')) return 'Wellness'

  return 'School'
}

function formatPostTime(dateValue: string | Date) {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>({
    userId: 0,
    userName: '',
    name: '',
    school: '',
    userClass: 128,
  })

  const [posts, setPosts] = useState<FeedPost[]>([])
  const [canClick, setCanClick] = useState(true)
  const [sdk, setSdk] = useState(new SenseiProductivity())
  const [loading, setLoading] = useState(true)

  const userAction = { 0: 'Add Friend', 64: 'Remove From School', 128: 'Ban User' } as const
  const afterAction = { 0: 'Friend Request Pending', 64: 'User Removed from School', 128: 'User Banned' } as const
  const actionToast = { 0: 'Friend request sent!', 64: 'User removed from school!', 128: 'User banned from app!' } as const
  const actionIcon = {
    0: <FontAwesome5 name="user-plus" size={24} color="white" />,
    64: <FontAwesome6 name="user-xmark" size={24} color="white" />,
    128: <FontAwesome6 name="school-circle-xmark" size={24} color="white" />,
  } as const

  function handleAction() {
    if (canClick) {
      console.log('@' + profile.userName + ': ' + actionToast[profile.userClass])
    }
    setCanClick(!canClick)
  }

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const accessToken = appStorage.getString('accessToken')

      if (accessToken === undefined) {
        Alert.alert(
          'Somehow user has managed to be logged out despite this having been avoided in a general case! Restart the app to log in.'
        )
        setLoading(false)
        return
      }

      try {
        const authedSdk = new SenseiProductivity({
          bearerAuth: `Bearer ${accessToken}`,
        })
        setSdk(authedSdk)

        const me = await authedSdk.users.me()

        const nextProfile: Profile = {
          userId: me.userId,
          userName: me.username,
          name: `${me.firstName} ${me.lastName}`,
          school: me.schoolName,
          userClass: 128,
        }

        setProfile(nextProfile)

        const userPosts = await authedSdk.users.posts.getByUserId({
          id: me.userId,
        })

        const mappedPosts: FeedPost[] = userPosts.map((item: any) => ({
          id: item.postId,
          user: nextProfile.name,
          handle: `@${nextProfile.userName}`,
          category: mapCategory(item.categoryName),
          title: item.title ?? item.categoryName ?? 'Post',
          body: item.details ?? item.caption ?? item.body ?? '',
          likes: item.likes ?? 0,
          time: formatPostTime(item.postDate),
        }))

        setPosts(mappedPosts)
      } catch (e) {
        console.log('Failed to fetch user profile or posts!')
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileAndPosts()
  }, [])

  if (loading) return null

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#404040' }}>
        <YStack flex={1}>
          <YStack p="$4" gap="$4">
            <XStack items="center" justify="space-between">
              <XStack items="center" gap="$3">
                <Avatar circular size="$8">
                  <Avatar.Image
                    src={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(profile.name)}`}
                  />
                  <Avatar.Fallback bg="#DDD" />
                </Avatar>

                <YStack p="$2">
                  <H1 size="$9" color="white">
                    {profile.name}
                  </H1>

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
              bg={canClick ? '#EC417A' : '#888'}
              color="white"
              size="$4"
              disabled={false}
              icon={actionIcon[profile.userClass]}
              onPress={handleAction}
            >
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
                <Paragraph p="$2" fontWeight="700">
                  Posts by {profile.name}
                </Paragraph>

                {posts.length === 0 ? (
                  <Paragraph color="#666">No posts found.</Paragraph>
                ) : (
                  posts.map((post) => <FeedCard key={post.id} post={post} />)
                )}
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
                src={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(post.user)}`}
              />
              <Avatar.Fallback bg="#DDD" />
            </Avatar>

            <YStack>
              <Paragraph fontWeight="700">{post.user}</Paragraph>
              <Paragraph color="#1A1A1A">{post.handle}</Paragraph>
            </YStack>
          </XStack>

          <XStack items="center" gap="$2">
            <YStack
              width={28}
              height={28}
              borderRadius={999}
              items="center"
              justify="center"
              bg={category.bg}
            >
              {category.icon}
            </YStack>
            <Paragraph fontWeight="600">{post.category}</Paragraph>
            <Paragraph color="#777">• {post.time}</Paragraph>
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