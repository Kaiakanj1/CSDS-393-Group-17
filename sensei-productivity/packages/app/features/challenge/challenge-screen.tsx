/**
 * This file contains the ChallengeAdminScreen component, which displays a leaderboard of schools based on points.
 */
'use client'
import { useEffect, useState } from 'react'
import { Button, H2, Paragraph, XStack, YStack } from '@my/ui'
import { View, ActivityIndicator } from 'react-native'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'  // pulls from api
import { appStorage } from "../lib/storage.js"

/**
 * Object type for leaderboard entries.
 */
type LeaderboardSchool = {
  rank: number
  school: string
  points: number
}

/**
 * ChallengeAdminScreen component displays the leaderboard of schools with their points. 
 * It handles loading states, errors, and allows refreshing the data.
 */
export function ChallengeAdminScreen() { 
  const [sdk, setSdk] = useState(new SenseiProductivity())
  const [topSchools, setTopSchools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showLeaderboard, setShowLeaderboard] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  /**
   * Loads the leaderboard data from the API, handles authentication, and updates state accordingly.
   */
  async function loadLeaderboard() {
  try {
    setLoading(true)

    const accessToken = appStorage.getString("accessToken")
    if (accessToken === undefined) {
      throw "User is not logged in somehow!"  // this should never happen since the screen is gated, but just in case
    }

    const authedSdk = new SenseiProductivity({
      bearerAuth: `Bearer ${accessToken}`
    })

    setSdk(authedSdk)

    const res = await authedSdk.schools.leaderboard(); // pulls from api

    const mappedSchools = res 
      .map((item: any) => ({
        school: item.schoolName,
        points: item.points ?? 0 // default to 0 if points is null or undefined
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)

    setTopSchools(mappedSchools)

  } catch (err) {
    console.error('Leaderboard load failed:', err) 
    setError('Failed to load leaderboard') // error message
  } finally {
    setLoading(false)
  }
}
/**
 * UI rendering with loading, error, and data states
 */
  return ( 
    <YStack flex={1} bg="#404040" p="$4" gap="$4">
      <XStack justify="space-between" items="center">
        <H2 color="white">Leaderboard</H2>

        <XStack gap="$2">
          <Button
            backgroundColor="#666"
            color="white"
            borderRadius={12}
            onPress={loadLeaderboard}
          >
            Refresh
          </Button>

          <Button
            backgroundColor="#EC417A"
            color="white"
            borderRadius={12}
            onPress={() => setShowLeaderboard(!showLeaderboard)}
          >
            {showLeaderboard ? 'Hide' : 'Show'}
          </Button>
        </XStack>
      </XStack>

      {showLeaderboard && (
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
          }}
        >
          {loading ? (
            <YStack items="center" gap="$3" py="$4">
              <ActivityIndicator size="large" />
              <Paragraph>Loading leaderboard...</Paragraph>
            </YStack>
          ) : error ? (
            <YStack gap="$3">
              <Paragraph color="red">{error}</Paragraph>
              <Button
                backgroundColor="#EC417A"
                color="white"
                borderRadius={12}
                onPress={loadLeaderboard}
              >
                Try Again
              </Button>
            </YStack>
          ) : topSchools.length === 0 ? (
            <Paragraph>No schools found.</Paragraph>
          ) : (
            <YStack gap="$3">
              {topSchools.map((item) => (
                <View
                  key={item.school}
                  style={{
                    backgroundColor: '#F7F7F7',
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <XStack key={item.school} justify="space-between" items="center">
                    <Paragraph fontWeight="700">
                      #{item.rank} {item.school}
                    </Paragraph>
                    <Paragraph color="#EC417A" fontWeight="700">
                      {item.points} pts
                    </Paragraph>
                  </XStack>
                </View>
              ))}
            </YStack>
          )}
        </View>
      )}
    </YStack>
  )
}