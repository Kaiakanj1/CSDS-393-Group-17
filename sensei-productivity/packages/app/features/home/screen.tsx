'use client'

import { Anchor, Button, H1, Paragraph, Separator, Sheet, SwitchThemeButton,
         useToastController, XStack, YStack, ScrollView } from '@my/ui'
import { ChevronDown, ChevronUp, Check as CheckIcon} from '@tamagui/lucide-icons'
import { Checkbox, Label, Theme } from 'tamagui'
import type { CheckboxProps } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import { useState } from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { useLink } from 'solito/navigation'
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context'


export function HomeScreen() {
  return (
    <YStack
			items="center"
			gap="$4"
			bg="#404040"
		>
			<YStack
				items="center"
				gap="$4"
				p="$4"
			>
				<H1 color="white">Time to lock in.</H1>
				<XStack
					width="100%"
					gap="$4"
					justify="center"
					flexWrap="wrap"
					$sm={{ position: 'relative', t: 0 }}
				>
        	<Button width="30%" size="$6" bg="#EC417A">
            <Ionicons name="school" size={24} color="white" />
        	</Button>
        	<Button width="30%" size="$6" bg="#54B41D">
            <MaterialIcons name="work" size={24} color="white" />
        	</Button>
        	<Button width="30%" size="$6" bg="#886BEF">
            <MaterialCommunityIcons name="head-heart" size={26} color="white" />
        	</Button>
        	{Platform.OS === 'web' && <SwitchThemeButton />}
      	</XStack>
      </YStack>
      <YStack
				items="center"
				bg="#404040"
        gap="$6"
      >
				<XStack
					width="100%"
					height="68%"
					gap="$4"
					justify="center"
					flexWrap="wrap"
					$sm={{ position: 'relative', t: 0 }}
				>
          <YStack gap="$0" flex={3}>
            <Paragraph
							color="$color10"
							text="center"
            >
              Column to the left
            </Paragraph>
          </YStack>
          <YStack gap="$0" flex={5}>
            <View style={{
							backgroundColor: "white",
							borderStyle: "solid",
              height: "100%",
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
							flex: 1,
							padding: 10,
							paddingRight: 0}}
            >
            	<ScrollView
            		bg="white"
            		stickyHeaderIndices={[0]}
            		id="TaskList"
            	>
								<H1 size="$8" bg="white" width="100%" p="$1">Tasks</H1>
								<TaskCheckbox />
								<TaskCheckbox label="Task number 1!" />
								<TaskCheckbox label="Task number 2!" />
								<TaskCheckbox label="Task number 3!" />
								<TaskCheckbox label="Task number 10!" />
								<TaskCheckbox label="Task number 15!" />
							</ScrollView>
						</View>
          </YStack>
        </XStack>
			<SheetDemo />
    	</YStack>
    </YStack>
  )
}

function TaskCheckbox({
  size="$4",
  label="New task",
  disabled,
  ...checkboxProps
}: CheckboxProps & { label?: string }) {
  const id = `checkbox-${label.replace(" ",'')}`
  return (
    <Theme>
			<YStack p="$2" gap="$0" bg="#EC417A">
				<XStack width="100%" gap="$4" items="center" >
					<Checkbox id={id} size={size} disabled={disabled} {...checkboxProps}>
						<Checkbox.Indicator>
							<CheckIcon />
						</Checkbox.Indicator>
					</Checkbox>

					<Label size={size} htmlFor={id} opacity={checkboxProps.checked==true ? 0.5 : 1}>
						{label}
					</Label>
				</XStack>
					<Paragraph>Deadline: </Paragraph>
      </YStack>
    </Theme>
  )
}

function SheetDemo() {
  const toast = useToastController()

  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)

  function newTask() {
    console.log("New task open=" + open)
    setOpen(true)
  }
  return (
    <>
      <Button
        size="$6"
        icon={<Feather name="edit" size={24} color="black" />}
        onPress={() => newTask()}
      >
      	{"New Task"}
      </Button>
      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          bg="$shadow4"
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle bg="$color8" />
        <Sheet.Frame
          items="center"
          justify="center"
          gap="$10"
          bg="$color2"
        >
          <XStack gap="$2">
            <Paragraph text="center">Made by</Paragraph>
            <Anchor
              color="$blue10"
              href="https://twitter.com/natebirdman"
              target="_blank"
            >
              @natebirdman,
            </Anchor>
            <Anchor
              color="$blue10"
              href="https://github.com/tamagui/tamagui"
              target="_blank"
              rel="noreferrer"
            >
              give it a ⭐️
            </Anchor>
          </XStack>

          <Button
            size="$6"
            circular
            icon={ChevronDown}
            onPress={() => {
              setOpen(false)
              toast.show('Sheet closed!', {
                message: 'Just showing how toast works...',
              })
            }}
          />
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
