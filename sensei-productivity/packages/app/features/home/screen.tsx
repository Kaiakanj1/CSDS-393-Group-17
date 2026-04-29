/**
 * This file contains the main HomeScreen component which displays the user's tasks and allows them to create new tasks. 
 * It uses the SenseiProductivity SDK to fetch and manage tasks, and Tamagui for UI components. 
 * The user can mark tasks as completed, and create new tasks with a description, category, and deadline.
 */
'use client'
import { useEffect, useState } from 'react'
import { SenseiProductivity } from '@aurora-interactive/sensei-productivity'
import { appStorage } from '../lib/storage.js'
import { DatePickerComponent } from './DatePicker'
import {
  Button, H1, Paragraph, Sheet, SwitchThemeButton,
  useToastController, XStack, YStack, ScrollView
} from '@my/ui'
import { Check as CheckIcon } from '@tamagui/lucide-icons'
import { Checkbox, Label, Theme, Input } from 'tamagui'
import type { CheckboxProps } from 'tamagui'
import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Feather from '@expo/vector-icons/Feather'
import { View, Platform, Alert } from 'react-native'


/**
 * Task type definition representing a user's task with an id, description, category, and deadline.
 */
type Task = {
  id: number
  description: string
  category: string
  deadline: Date
}

/**
 * Main HomeScreen component that displays the user's tasks and allows them to create new tasks.
 */
export function HomeScreen() {
  // State variables for managing tasks, loading state, error messages, and SDK instance
  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'School' | 'Work' | 'Personal'
  >('All')
  const [posts, setPosts] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sdk, setSdk] = useState(new SenseiProductivity())

  useEffect(() => {
    init()
  }, [])

  /**
   * Loads tasks for the authenticated user.
   * @param authedSdk 
   */
  async function loadTasks(authedSdk?: SenseiProductivity) {
    try {
      setLoading(true)

      const sdkToUse = authedSdk ?? sdk
      const userInfo = await sdkToUse.users.me()

      const res = (
        await sdkToUse.users.activities.getAllOfUser({
          id: userInfo.userId,
        })
      )?.filter((x) => x.activityStatus === 'active')

      console.log('me response:', res)

      const mappedTasks: Task[] = res.map((item) => ({
        id: item.activityId,
        description: item.details,
        category: item.categoryName,
        deadline: new Date(item.activityDeadline),
      }))

      setPosts(mappedTasks)
    } catch (err) {
      console.error('Load tasks failed:', err)
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Initializes the SDK with the user's access token and loads their tasks. 
   * If the user is not logged in, it sets an error message.
   */
  async function init() {
    try {
      setLoading(true)

      const accessToken = appStorage.getString('accessToken')
      if (accessToken === undefined) {
        throw new Error('User is not logged in somehow!')
      }

      const authedSdk = new SenseiProductivity({
        bearerAuth: `Bearer ${accessToken}`,
      })

      setSdk(authedSdk)
      await loadTasks(authedSdk)
    } catch (err) {
      console.error('Init failed:', err)
      setError('Failed to load feed')
      setLoading(false)
    }
  }

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
          <YStack gap="$0" flex={1}>
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
              paddingRight: 0
            }}
            >
              <ScrollView
                bg="#EC417A"
                stickyHeaderIndices={[0]}
                id="TaskList"
              >
                <H1 size="$8" bg="white" width="100%" p="$1">Tasks</H1>
                {posts.map(post => <TaskCheckbox onCheckedChange={async () => {
                  try {
                    const res = await sdk.users.activities.update({
                      id: post.id,
                      body: {
                        activityStatus: "completed"
                      }
                    })

                    setPosts(posts => {
                      return posts.filter(x => x.id !== post.id)
                    });
                  } catch (e) {
                    Alert.alert("Failed to mark task as completed!");
                    console.log(e);
                  }
                }} key={post.id} label={post.description} postId={post.id} deadline={new Date(post.deadline)} />)}
              </ScrollView>
            </View>
          </YStack>
        </XStack>
       <NewTaskButton onTaskCreated={loadTasks} />
      </YStack>
    </YStack>
  )
}

/**
 * Component representing a single task with a checkbox to mark it as completed. 
 * It displays the task description and deadline, and calls the provided onCheckedChange function when the checkbox state changes.
 */
function TaskCheckbox({
  size = "$4",
  label = "New task",
  postId,
  deadline,
  disabled,
  ...checkboxProps
}: CheckboxProps & { label?: string, postId: number, deadline: Date }) {
  return (
    <Theme>
      <YStack p="$2" gap="$0" bg="#EC417A">
        <XStack width="100%" gap="$4" items="center" >
          <Checkbox id={`${postId}`} size={size} disabled={disabled} {...checkboxProps}>
            <Checkbox.Indicator>
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox>
          <Label size={size} htmlFor={`${postId}`} opacity={checkboxProps.checked == true ? 0.5 : 1}>
            {label}
          </Label>
        </XStack>
        <Paragraph>
          Deadline: {deadline.toLocaleDateString()}
        </Paragraph>
      </YStack>
    </Theme>
  )
}

/**
 * NewTaskButton component that opens a sheet allowing the user to create a new task with a description, category, and deadline.
 * It uses the SenseiProductivity SDK to create the task and calls the onTaskCreated callback to refresh the task list after creation.
 */
function NewTaskButton({
  onTaskCreated,
}: {
  onTaskCreated: () => Promise<void>
}) {
  const toast = useToastController()

  // State variables for managing the sheet's open state, position, task description, category, selected dates, submitting state, and SDK instance
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState(0)
  const [taskDescription, setTaskDescription] = useState('')
  const [categoryName, setCategoryName] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [submitting, setSubmitting] = useState(false)
  
  const [sdk, setSdk] = useState(new SenseiProductivity())

  /**
   * Resets the form fields and closes the sheet after a task is created.
   */
  function resetForm() {
    setOpen(false)
    setTaskDescription('')
    setCategoryName('')
    setSelectedDates([])
  }

  useEffect(() => {
    initSdk()
  }, [])

  /**
   * Initializes the SenseiProductivity SDK with the user's access token. If the user is not logged in, it logs an error message.
   * This function is called when the component mounts to ensure the SDK is ready for creating tasks.
   */
  async function initSdk() {
    try {
      const accessToken = appStorage.getString('accessToken')

      if (!accessToken) {
        throw new Error('User is not logged in')
      }

      const authedSdk = new SenseiProductivity({
        bearerAuth: `Bearer ${accessToken}`,
      })

      setSdk(authedSdk)
    } catch (err) {
      console.error('SDK init failed:', err)
    }
  }

  /**
   * Handles the creation of a new task by validating the input fields, calling the SDK to create the task, and refreshing the task list.
   * It also displays appropriate alerts for validation errors and success/failure of task creation.
   */
  async function handleCreateTask() {
    try {
      if (!taskDescription.trim()) {
        Alert.alert('Please enter a task description')
        return
      }

      if (!categoryName) {
        Alert.alert('Please choose a category')
        return
      }

      if (!selectedDates[0]) {
        Alert.alert('Please select a deadline')
        return
      }

      setSubmitting(true)

      const result = await sdk.users.activities.create({
        categoryName,
        activityDeadline: selectedDates[0],
        details: taskDescription,
      })

      console.log('Created task:', result)

      await onTaskCreated()
      Alert.alert('Task created successfully')
      resetForm()
    } catch (err: any) {
      console.error('Error creating task:', err)

      const msg = String(err?.message ?? err ?? '')
      const looksLikeCreated =
        msg.includes('Status 200') &&
        msg.includes('"activityId"') &&
        msg.includes('"categoryName"') &&
        msg.includes('"activityDeadline"')

      if (looksLikeCreated) {
        await onTaskCreated()
        Alert.alert('Task created successfully')
        resetForm()
        return
      }

      Alert.alert('Failed to create task')
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Opens the sheet when the "New Task" button is pressed. 
   */
  function newTask() {
    setOpen(true)
  }

  return (
    <>
      <Button
        size="$6"
        icon={<Feather name="edit" size={24} color="black" />}
        onPress={newTask}
      >
        New Task
      </Button>

      <Sheet
        modal
        animation="medium"
        open={open}
        onOpenChange={setOpen}
        snapPoints={[60]}
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
          gap="$4"
          p="$6"
          bg="$color2"
        >
          <H1 size="$9" width="100%">New Task</H1>

          <YStack gap="$2" items="flex-start" width="100%">
            <Label>Task Description</Label>
            <Input
              size="$5"
              width="100%"
              borderWidth={2}
              value={taskDescription}
              onChangeText={setTaskDescription}
            />

            <Label>Category</Label>
            <XStack width="100%" gap="$3">
              <Button
                width="30%"
                size="$6"
                bg={categoryName === 'School' ? '#EC417A' : '#F3F3F3'}
                onPress={() => setCategoryName('School')}
              >
                <Ionicons
                  name="school"
                  size={24}
                  color={categoryName === 'School' ? 'white' : 'black'}
                />
              </Button>

              <Button
                width="30%"
                size="$6"
                bg={categoryName === 'Professional' ? '#54B41D' : '#F3F3F3'}
                onPress={() => setCategoryName('Professional')}
              >
                <MaterialIcons
                  name="work"
                  size={24}
                  color={categoryName === 'Professional' ? 'white' : 'black'}
                />
              </Button>

              <Button
                width="30%"
                size="$6"
                bg={categoryName === 'Personal' ? '#886BEF' : '#F3F3F3'}
                onPress={() => setCategoryName('Personal')}
              >
                <MaterialCommunityIcons
                  name="head-heart"
                  size={26}
                  color={categoryName === 'Personal' ? 'white' : 'black'}
                />
              </Button>
            </XStack>

            <Label>Deadline</Label>
            <DatePickerComponent
              selectedDates={selectedDates}
              onDatesChange={setSelectedDates}
            />
          </YStack>

          <XStack gap="$4">
            <Button
              size="$6"
              color="black"
              onPress={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              size="$6"
              bg="#EC417A"
              color="white"
              disabled={submitting}
              onPress={handleCreateTask}
            >
              {submitting ? 'Creating...' : 'Create Task'}
            </Button>
          </XStack>
        </Sheet.Frame>
      </Sheet>
    </>
  )
}
