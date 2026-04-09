'use client'

import { useEffect, useState } from 'react'
import {
  Avatar,
  Button,
  H1,
  Paragraph,
  ScrollView,
  Separator,
  XStack,
  YStack,
  Input,
} from '@my/ui'
import { Bell } from '@tamagui/lucide-icons'
import { Theme } from 'tamagui'
import Entypo from '@expo/vector-icons/Entypo'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'
import { appStorage } from '../lib/storage.js'

type FeedPost = {
  id: number
  user: number
  category: string
  likes: number
  date: Date
  likedByCurrentUser: boolean
}

export function FeedScreen() {
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'School' | 'Work' | 'Personal'
  >('All')

  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sdk, setSdk] = useState(new SenseiProductivity())

  const [showSearch, setShowSearch] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [friendMessage, setFriendMessage] = useState('')

  useEffect(() => {
    init()
  }, [])

  async function init() {
    try {
      setLoading(true)

      const accessToken = appStorage.getString('accessToken')
      if (accessToken === undefined) {
        throw 'User is not logged in somehow!'
      }

      const authedSdk = new SenseiProductivity({
        bearerAuth: `Bearer ${accessToken}`,
      })
      setSdk(authedSdk)

      const res = await authedSdk.users.posts.feed()
      console.log('feed response:', res)

      const posts = Array.isArray(res) ? res : res.data ?? res.posts ?? []

      const mappedPosts: FeedPost[] = posts.map((item) => ({
        id: item.postId,
        user: item.userId,
        category: item.categoryName,
        likes: item.likes,
        date: new Date(item.postDate),
        likedByCurrentUser: true,
      }))

      setPosts(mappedPosts)
    } catch (err) {
      console.error('Init failed:', err)
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = () => {
    if (!usernameInput.trim()) return

    setFriendMessage('Friend Added')
    setUsernameInput('')

    setTimeout(() => {
      setFriendMessage('')
      setShowSearch(false)
    }, 1500)
  }

  const filteredPosts =
    selectedFilter === 'All'
      ? posts
      : posts.filter((post) => post.category === selectedFilter)

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

          <XStack gap="$2">
            <Button
              size="$3"
              bg="#666"
              color="white"
              onPress={() => {
                setShowSearch((prev) => !prev)
                setFriendMessage('')
              }}
            >
              Search
            </Button>

            <Button circular size="$4" icon={<Bell color="white" size={18} />} />
          </XStack>
        </XStack>

        {showSearch && (
          <YStack
            bg="white"
            p="$3"
            borderRadius={12}
            gap="$2"
            maxWidth={220}
          >
            <Input
              size="$2"
              placeholder="Enter username"
              value={usernameInput}
              onChangeText={setUsernameInput}
            />

            <Button size="$2" onPress={handleAddFriend}>
              Add
            </Button>

            {friendMessage ? (
              <Paragraph color="green">{friendMessage}</Paragraph>
            ) : null}
          </YStack>
        )}

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
            label="Personal"
            active={selectedFilter === 'Personal'}
            onPress={() => setSelectedFilter('Personal')}
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
            {loading ? (
              <Paragraph>Loading feed...</Paragraph>
            ) : error ? (
              <Paragraph color="red">{error}</Paragraph>
            ) : (
              filteredPosts.map((post) => (
                <FeedCard key={post.id} post={post} sdk={sdk} />
              ))
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  )
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function FeedCard({ post, sdk }: { post: FeedPost; sdk: SenseiProductivity }) {
  const [liked, setLiked] = useState(post.likedByCurrentUser)
  const [likes, setLikes] = useState(post.likes)

  const changeLike = async () => {
    const wasLikedBefore = liked
    setLiked(!liked)

    if (!wasLikedBefore) {
      setLikes((likes) => (liked ? likes - 1 : likes + 1))
    }

    try {
      await sdk.users.posts[wasLikedBefore ? 'removeLike' : 'like']({
        id: post.id,
      })

      if (wasLikedBefore) {
        setLikes((likes) => (liked ? likes - 1 : likes + 1))
      }
    } catch (e) {
      console.log('Failed to update the like status with the API!')
      if (!wasLikedBefore) {
        setLikes((likes) => (liked ? likes + 1 : likes - 1))
      }
      setLiked((liked) => !liked)
      console.log(e)
    }
  }

  return (
    <Theme>
      <YStack
        bg="white"
        borderWidth={1}
        borderColor="#EAEAEA"
        borderRadius={18}
        overflow="hidden"
      >
        <YStack p="$4" gap="$3">
          <XStack items="center" gap="$3">
            <Avatar circular size="$4">
              <Avatar.Image
                src={`https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                  String(post.user)
                )}`}
              />
              <Avatar.Fallback bg="#DDD" />
            </Avatar>

            <YStack>
              <Paragraph fontWeight="700">User {post.user}</Paragraph>
              <Paragraph color="#666">Post #{post.id}</Paragraph>
            </YStack>
          </XStack>

          <XStack justify="space-between" items="center">
            <Paragraph fontWeight="600">{post.category}</Paragraph>
            <Paragraph color="#666">{formatDate(post.date)}</Paragraph>
          </XStack>

          <Separator />

          <XStack items="center" gap="$2">
            <Button
              icon={
                !liked ? (
                  <Entypo name="heart-outlined" size={24} color="black" />
                ) : (
                  <Entypo name="heart" size={24} color="red" />
                )
              }
              onPress={() => changeLike()}
            />
            <Paragraph>{likes} likes</Paragraph>
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
      color="white"
      opacity={active ? 0.8 : 1}
      borderWidth={1}
      style={{
        backgroundColor: bg,
        borderColor: active ? bg : '#888',
      }}
    >
      {label}
    </Button>
  )
}