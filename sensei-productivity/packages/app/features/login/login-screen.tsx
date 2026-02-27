import { HomeScreen } from 'app/features/home/screen'
import { Facebook, Github } from '@tamagui/lucide-icons'
import React from 'react'
import { useState } from 'react'
import {StyleSheet, TextInput} from 'react-native';
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
import { SenseiProductivity } from "@aurora-interactive/sensei-productivity"

export function LoginScreen() {
	const senseiProductivity = new SenseiProductivity({})
	const [uText, onChangeUsername] = React.useState('')
	const [pText, onChangePassword] = React.useState('')
  const { signIn, status } = useSignIn()

  function useSignIn() {
		const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
		return {
			status: status,
			signIn: () => {
				setStatus('loading')
				setTimeout(() => {

					tryLogIn()
 					setStatus('success')
				}, 2000)
			},
		}

	}

	async function tryLogIn() {
		try {
			console.log("trying to log in now")
			const res = await senseiProductivity.users.login({
				username: uText,
				password: pText,
			})
      console.log("Login successful!")
			console.log(res)
		}
		catch (error){
			console.error("Login failed. Incorrect username or password.")
		}
	}

  return (
    <FormCard>
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
            <ForgotPasswordLink />
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
        <View flexDirection="column" gap="$3" width="100%" items="center">
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
              <View flexDirection="row" flexWrap="wrap" gap="$3">
                <Button flex={1} minW="100%">
                  <Button.Icon>
                    <Github color="$color10" size="$1" />
                  </Button.Icon>
                  <Button.Text>Continue with Github</Button.Text>
                </Button>
                <Button flex={1}>
                  <Button.Icon>
                    <Facebook color="$blue10" size="$1" />
                  </Button.Icon>
                  <Button.Text>Continue with Facebook</Button.Text>
                </Button>
              </View>
            </View>
          </Theme>
        </View>
        <SignUpLink />
      </View>
    </FormCard>
  )
}





// Swap for your own Link
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

const ForgotPasswordLink = () => {
  return (
    <Anchor self="flex-end" href={`#`}>
      <Paragraph
        color="$color11"
        hoverStyle={{
          color: '$color12',
        }}
        size="$1"
        mt="$1"
      >
        Forgot your password?
      </Paragraph>
    </Anchor>
  )
}