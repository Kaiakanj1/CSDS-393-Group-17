// import { HomeScreen } from 'app/features/home/screen'
// import { Facebook, Github } from '@tamagui/lucide-icons'
// import React from 'react'
import { useState } from 'react'
import {TextInput, Alert} from 'react-native';
import {appStorage} from "../lib/storage"
import RNRestart from 'react-native-restart';
import {
  Anchor,
  AnimatePresence,
  Button,
  H1,
  Paragraph,
  Separator,
  SizableText,
  Spinner,
  Theme,
  View
} from 'tamagui'
import { Input } from '../login/inputsParts'
import { FormCard } from '../login/layoutParts'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SenseiProductivity } from "@aurora-interactive/sensei-productivity"

export function LoginScreen() {
	const senseiProductivity = new SenseiProductivity({})
	const [uText, onChangeUsername] = useState('')
	const [pText, onChangePassword] = useState('')
  const { signIn, status } = useSignIn()
  const safeAreaInsets = useSafeAreaInsets();

  function useSignIn() {
		const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
		return {
			status: status,
			signIn: () => {
				setStatus('loading')
				return new Promise(async (resolve, reject) => {

					await tryLogIn()
 					setStatus('success')
          resolve(true);
				})
			},
		}

	}

	async function tryLogIn() {
		try {
			const res = await senseiProductivity.users.login({
				username: uText,
				password: pText,
			})
      appStorage.set("accessToken", res.accessToken);
      RNRestart.restart();
		}
		catch (error){
			Alert.alert("Login Failed", "Invalid username or password")
		}
	}

  return (
    <FormCard style={{paddingTop: safeAreaInsets.top}}>
      <View
      	p="$4"
        flexDirection="column"
        items="stretch"
        minW="100%"
        maxW="100%"
        gap="$6"
      >
        <H1
          self="center"
          size="$8"
          $xs={{
            size: '$7',
          }}
        >
          Sign in to your account
        </H1>
        <View flexDirection="column" gap="$8">
          <View flexDirection="column" gap="$1">
            <TextInput 
							id="username"
							placeholder="Enter username"
							onChangeText={onChangeUsername}
							defaultValue={uText}
						></TextInput>
          </View>
          <View flexDirection="column" gap="$1">
            <TextInput
            	secureTextEntry
							id={'password'}
							placeholder="Enter password"
							onChangeText={onChangePassword}
							defaultValue={pText}
						></TextInput>
            {/* <ForgotPasswordLink /> */}
          </View>
        </View>

        <Button
          disabled={status === 'loading'}
          onPress={signIn}
          width="100%"
          iconAfter={
            <AnimatePresence>
              {status === 'loading' && (
                <Spinner
                  color="$color"
                  key="loading-spinner"
                  opacity={1}
                  scale={1}
                  transition="quick"
                  position="absolute"
                  l="60%"
                  enterStyle={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  exitStyle={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                />
              )}
            </AnimatePresence>
          }
        >
          <Button.Text>Sign In</Button.Text>
        </Button>
        {/* <View flexDirection="column" gap="$3" width="100%" items="center">
          <Theme>
            <View
              flexDirection="column"
              gap="$3"
              width="100%"
              self="center"
              items="center"
            >
              <View flexDirection="row" width="100%" items="center" gap="$4">
                <Separator />
                <Paragraph>Or</Paragraph>
                <Separator />
              </View>
            </View>
          </Theme>
        </View> */}
        {/* <SignUpLink /> */}
      </View>
    </FormCard>
  )
}

const Link = ({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) => {
  return <Anchor href={href}>{children}</Anchor>
}

const SignUpLink = () => {
  return (
    <Link href={`#`}>
      <Paragraph textDecorationStyle="unset" text="center">
        Don&apos;t have an account?{' '}
        <SizableText
          hoverStyle={{
            color: '$colorHover',
          }}
          textDecorationLine="underline"
        >
          Sign up
        </SizableText>
      </Paragraph>
    </Link>
  )
}

// const ForgotPasswordLink = () => {
//   return (
//     <Anchor self="flex-end" href={`#`}>
//       <Paragraph
//         color="$color11"
//         hoverStyle={{
//           color: '$color12',
//         }}
//         size="$1"
//         mt="$1"
//       >
//         Forgot your password?
//       </Paragraph>
//     </Anchor>
//   )
// }