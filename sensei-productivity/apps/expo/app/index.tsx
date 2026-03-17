import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Tasks',
        }}
      />
      <HomeScreen />
    </>
  )
}


// export function HomeScreen() {
//   return (
//     <>
//       <Stack.Screen
//         options={{
//           title: 'Tasks',
//         }}
//       />
//       <HomeScreen />
//     </>
//   )
// }
