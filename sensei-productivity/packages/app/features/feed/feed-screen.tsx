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
import { Heart, MessageCircle, Bell, Plus } from '@tamagui/lucide-icons'
import { Theme } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

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
    user: 'Jordan Lee',
    handle: '@jordlee',
    category: 'Work',
    title: 'Big productivity win today',
    body: 'Finally wrapped up the internship application tracker and cleaned up my resume tasks. Tiny systems really do help.',
    likes: 27,
    time: '4h ago',
  },
  {
    id: 3,
    user: 'Avery Patel',
    handle: '@averyp',
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

export function FeedScreen() {
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'School' | 'Work' | 'Wellness'
  >('All')

  const filteredPosts =
    selectedFilter === 'All'
      ? mockPosts
      : mockPosts.filter((post) => post.category === selectedFilter)

  return (
    <YStack flex={1} bg="#404040">
      <YStack p="$4" gap="$4">
        <XStack items="center" justify="space-between">
          <YStack>
            <H1 color="white">Your Feed</H1>
            <Paragraph color="$color10">
              See what everyone is working on.
            </Paragraph>
          </YStack>

          <Button
            circular
            size="$4"
            bg="#EC417A"
            icon={<Bell color="white" size={18} />}
          />
        </XStack>

        <XStack gap="$3" flexWrap="wrap">
          <FilterChip
            label="All"
            active={selectedFilter === 'All'}
            onPress={() => setSelectedFilter('All')}
            bg="#666"
          />
          <FilterChip
            label="School"
            active={selectedFilter === 'School'}
            onPress={() => setSelectedFilter('School')}
            bg="#EC417A"
          />
          <FilterChip
            label="Work"
            active={selectedFilter === 'Work'}
            onPress={() => setSelectedFilter('Work')}
            bg="#54B41D"
          />
          <FilterChip
            label="Wellness"
            active={selectedFilter === 'Wellness'}
            onPress={() => setSelectedFilter('Wellness')}
            bg="#886BEF"
          />
        </XStack>
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
            {filteredPosts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </YStack>
        </ScrollView>
      </YStack>

    </YStack>
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

function FilterChip({
  label,
  active,
  onPress,
  bg,
}: {
  label: string
  active: boolean
  onPress: () => void
  bg: string
}) {
  return (
    <Button
      size="$3"
      onPress={onPress}
      bg={bg}
      borderWidth={1}
      borderStyle="solid"
      borderEndColor={active ? bg : '#888'}
      color="white"
      opacity={active ? 0.8 : 1}
    >
      {label}
    </Button>
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