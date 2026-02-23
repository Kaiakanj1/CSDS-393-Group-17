'use client'

import { Anchor, Button, H1, Paragraph, Separator, Sheet, SwitchThemeButton,
         useToastController, XStack, YStack, ScrollView } from '@my/ui'
import { ChevronDown, ChevronUp, Check as CheckIcon} from '@tamagui/lucide-icons'
import { Checkbox, Label, Theme } from 'tamagui'
import type { CheckboxProps } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import React from 'react'
import { View, StyleSheet, Platform, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { useLink } from 'solito/navigation'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'
import { SenseiProductivity } from "@aurora-interactive/sensei-productivity"



const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },
})

export function LoginScreen() {
		const [username, onChangeUsername] = React.useState('')
		const [password, onChangePassword] = React.useState('')
	return(
		<SafeAreaProvider>
		<SafeAreaView>
		<YStack
			height="100%"
			items="center"
			gap="$4"
			p="$2"
			bg="#404040"
		>
			<Separator />
			<H1 color="white">Welcome to Sensei.</H1>
				<TextInput
					width="50%"
          style={styles.input}
          onChangeText={onChangeUsername}
          placeholder="username"
          defaultValue={username}
        />
        <TextInput
        	width="50%"
          style={styles.input}
          onChangeText={onChangePassword}
          defaultValue={password}
          placeholder="password"
        />
		</YStack>

		</SafeAreaView>
	</SafeAreaProvider>

	)
}