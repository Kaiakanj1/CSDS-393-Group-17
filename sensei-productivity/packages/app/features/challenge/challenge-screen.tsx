'use client'

import { useState } from 'react'
import { Button, H2, Paragraph, XStack, YStack, ScrollView } from '@my/ui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import Feather from '@expo/vector-icons/Feather'
import { View } from 'react-native'

export function ChallengeAdminScreen() {
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const challenge = {
    title: 'Midterm Study Challenge',
    school: 'Case Western Reserve University',
    percentCompleted: 68,
    avgHours: 12.4,
    activeStudents: 284,
    goalHours: 15,
    totalParticipants: 420,
  }

  const topSchools = [
    { rank: 1, school: 'Case Western Reserve University', points: 1280 },
    { rank: 2, school: 'Ohio State University', points: 1215 },
    { rank: 3, school: 'University of Michigan', points: 1170 },
  //  { rank: 4, school: 'Carnegie Mellon University', points: 1110 },
  //  { rank: 5, school: 'Purdue University', points: 1055 },
  ]

  const recentActivity = [
    { name: 'Alyssa P.', action: 'completed the challenge', time: '10 min ago' },
    { name: 'Jordan K.', action: 'completed the challenge', time: '25 min ago' },
    { name: 'Nina R.', action: 'joined the challenge', time: '40 min ago' },
    { name: 'Marcus T.', action: 'completed the challenge', time: '1 hr ago' },
  ]

  return (
    <YStack flex={1} bg="#404040" p="$4" gap="$4">
      <YStack gap="$2">
        <H2 color="white">Challenge Dashboard</H2>
        <Paragraph color="$color10">
          {challenge.school} · School Admin View
        </Paragraph>
      </YStack>

      <XStack justify="flex-end">
        <Button
          backgroundColor="#EC417A"
          color="white"
          borderRadius={12}
          onPress={() => setShowLeaderboard(!showLeaderboard)}
        >
          {showLeaderboard ? 'Hide Leaderboard' : 'Leaderboard'}
        </Button>
      </XStack>

      {showLeaderboard && (
        <DashboardCard title="Top Schools by Challenge Points">
          <YStack gap="$3">
            {topSchools.map((item) => (
              <View
                key={item.rank}
                style={{
                  backgroundColor: '#F7F7F7',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <XStack justify="space-between" items="center">
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
        </DashboardCard>
      )}

      <View
        style={{
          backgroundColor: '#EC417A',
          borderRadius: 16,
          padding: 18,
        }}
      >
        <YStack gap="$2">
          <Paragraph color="white" fontWeight="700">
            Active Challenge
          </Paragraph>
          <H2 color="white">{challenge.title}</H2>
          <Paragraph color="white">
            Track participation and study engagement across campus.
          </Paragraph>
        </YStack>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack gap="$4" pb="$6">
          <XStack gap="$4" flexWrap="wrap">
            <StatCard
              title="Completed"
              value={`${challenge.percentCompleted}%`}
              subtitle={`${Math.round(
                (challenge.percentCompleted / 100) * challenge.totalParticipants
              )} of ${challenge.totalParticipants} students`}
              icon={<Ionicons name="checkmark-done" size={22} color="white" />}
              bg="#54B41D"
            />

            <StatCard
              title="Avg Study Hours"
              value={`${challenge.avgHours}`}
              subtitle={`Goal: ${challenge.goalHours} hrs`}
              icon={<Feather name="clock" size={22} color="white" />}
              bg="#886BEF"
            />

            <StatCard
              title="Active Students"
              value={`${challenge.activeStudents}`}
              subtitle="Currently participating"
              icon={<MaterialIcons name="groups" size={22} color="white" />}
              bg="#2D9CDB"
            />
          </XStack>

          <DashboardCard title="Challenge Progress">
            <YStack gap="$3">
              <ProgressRow
                label="Students completed"
                value={challenge.percentCompleted}
                color="#EC417A"
              />
              <ProgressRow
                label="Average hours toward goal"
                value={Math.min(
                  Math.round((challenge.avgHours / challenge.goalHours) * 100),
                  100
                )}
                color="#54B41D"
              />
            </YStack>
          </DashboardCard>

          <XStack gap="$4" flexWrap="wrap">
            <DashboardCard title="Recent Activity" flex={1} minWidth={320}>
              <YStack gap="$3">
                {recentActivity.map((item, index) => (
                  <View
                    key={`${item.name}-${index}`}
                    style={{
                      backgroundColor: '#F7F7F7',
                      borderRadius: 12,
                      padding: 12,
                    }}
                  >
                    <Paragraph fontWeight="700">{item.name}</Paragraph>
                    <Paragraph>{item.action}</Paragraph>
                    <Paragraph color="#777">{item.time}</Paragraph>
                  </View>
                ))}
              </YStack>
            </DashboardCard>
          </XStack>
        </YStack>
      </ScrollView>
    </YStack>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  bg,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  bg: string
}) {
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 16,
        padding: 16,
        minWidth: 220,
        flexGrow: 1,
        flexBasis: 220,
      }}
    >
      <YStack gap="$2">
        <XStack justify="space-between" items="center">
          <Paragraph color="white" fontWeight="700">
            {title}
          </Paragraph>
          {icon}
        </XStack>
        <H2 color="white">{value}</H2>
        <Paragraph color="white">{subtitle}</Paragraph>
      </YStack>
    </View>
  )
}

function DashboardCard({
  title,
  children,
  flex,
  minWidth,
}: {
  title: string
  children: React.ReactNode
  flex?: number
  minWidth?: number
}) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        flex: flex ?? 0,
        minWidth: minWidth ?? 0,
      }}
    >
      <YStack gap="$3">
        <H2>{title}</H2>
        {children}
      </YStack>
    </View>
  )
}

function ProgressRow({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <YStack gap="$2">
      <XStack justify="space-between">
        <Paragraph>{label}</Paragraph>
        <Paragraph>{value}%</Paragraph>
      </XStack>
      <View
        style={{
          height: 12,
          backgroundColor: '#E5E5E5',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 999,
          }}
        />
      </View>
    </YStack>
  )
}