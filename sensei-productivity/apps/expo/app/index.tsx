import { HomeScreen } from 'app/features/home/screen'
import { LoginScreen } from 'app/features/login/login-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Login',
        }}
      />
      <LoginScreen />
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
