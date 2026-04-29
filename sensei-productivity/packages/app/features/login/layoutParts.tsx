/**
 * This file contains the layout components for the login page. 
 * These components are used to create the structure and styling of the login page, such as the form card and the hide component for responsive design.
 */
import { View, styled } from 'tamagui'
import { useMedia } from 'tamagui'
import type { MediaQueryKey } from '@tamagui/web'

/**
 * FormCard is a styled component that represents the card that contains the login form. 
 */
export const FormCard = styled(View, {
  render: 'form',
  flexDirection: 'row',
  maxW: '100%',
  rounded: 30,
  $gtSm: {
    p: '$6',
    shadowColor: '$shadowColor',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
  },
  $xs: {
    borderWidth: 0,
    rounded: 0,
    px: '$1',
  },
})

/**
 * Hide is a component that conditionally renders its children based on the screen size. 
 * It uses the useMedia hook from Tamagui to determine the current screen size and hides the children if the specified media query matches.
 */
export const Hide = ({
  children,
  when = 'sm',
}: { children: React.ReactNode; when: MediaQueryKey }) => {
  const hide = useMedia()[when]

  if (hide) {
    return null
  }
  return children
}

