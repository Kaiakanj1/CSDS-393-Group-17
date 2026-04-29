/**
 * This file contains the LoginScreen component for the Sensei Productivity app.
 */
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

/**
 * LoginScreen component for the Sensei Productivity app.
 */
export function LoginScreen() {
	const senseiProductivity = new SenseiProductivity({})
	const [uText, onChangeUsername] = useState('')
	const [pText, onChangePassword] = useState('')
  const { signIn, status } = useSignIn()
  const safeAreaInsets = useSafeAreaInsets();

  /**
   * Custom hook to manage the sign-in process, including loading state and error handling.
   */
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

  /**
   * Attempts to log in the user using the provided username and password. 
   * On success, stores the access token and restarts the app. 
   * On failure, shows an alert.
   */
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
      </View>
    </FormCard>
  )
}

