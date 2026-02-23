import { HomeScreen } from 'app/features/home/screen'
import { Stack } from 'expo-router'
import { SenseiProductivity } from "@aurora-interactive/sensei-productivity"


const senseiProductivity = new SenseiProductivity({
  bearerAuth: process.env["SENSEIPRODUCTIVITY_BEARER_AUTH"] ?? "",
})

async function run() {
  const result = await senseiProductivity.users.login({
    username: "Kacey40",
    password: "fbdGuMZsSr2v5wZ",
  })
}

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
