import { Facebook, Github } from '@tamagui/lucide-icons'
import { useState } from 'react'
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
  View,
} from 'tamagui'
import { Input } from '../login/inputsParts'
import { FormCard } from '../login/layoutParts'
import { SenseiProductivity } from "../@aurora-interactive/sensei-productivity";

const senseiProductivity = new SenseiProductivity({
  	bearerAuth: process.env["SENSEIPRODUCTIVITY_BEARER_AUTH"] ?? "",
	})

/** simulate signin */
async function useSignIn() {
	const Username = this.getElementById("username").value
	const Password = this.getElementById("password").value
	console.log(username, password)
	const result = await senseiProductivity.users.login({
		username: Username,
		password: Password,
	})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  return {
    status: status,
    signIn: () => {
      setStatus('loading')
      setTimeout(() => {
        setStatus('success')
      }, 2000)
    },
  }
}

/** ------ EXAMPLE ------ */
export function LoginScreen() {
  const { signIn, status } = useSignIn()
  return (
    <FormCard>
      <View
      	p="$4"
        flexDirection="column"
        items="stretch"
        minW="100%"
        maxW="100%"
        gap="$4"
        $gtSm={{
          py: '$4',
          width: 400,
        }}
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
        <View flexDirection="column" gap="$3">
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <Input.Label htmlFor="username">Username</Input.Label>
              <Input.Box>
                <Input.Area
                	id="username"
                	placeholder="Enter username"
								/>
              </Input.Box>
            </Input>
          </View>
          <View flexDirection="column" gap="$1">
            <Input size="$4">
              <View flexDirection="row" items="center" justify="space-between">
                <Input.Label htmlFor={'password'}>Password</Input.Label>
              </View>
              <Input.Box>
                <Input.Area
                  secureTextEntry
                  id={'password'}
                  placeholder="Enter password"
                />
              </Input.Box>
              <ForgotPasswordLink />
            </Input>
          </View>
        </View>

        <Button
          theme="accent"
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
