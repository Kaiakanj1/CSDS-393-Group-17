import { View, styled } from 'tamagui'
import { useMedia } from 'tamagui'
import type { MediaQueryKey } from '@tamagui/web'

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

