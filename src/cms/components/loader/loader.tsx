import { keyframes } from '@stitches/react'
import { CircleNotch } from 'phosphor-react'
import { styled } from '../../../../stitches.config'

export interface LoaderProps {
  children?: React.ReactNode
}

const Loader = ({ children }: LoaderProps) => {
  return (
    <StyledLoader>
      <div className="loader_internal">
        <CircleNotch size={24} weight="bold" />
        {children || 'Getting your content ready...'}
      </div>
    </StyledLoader>
  )
}

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
})

const StyledLoader = styled('div', {
  height: '100vh',
  width: '100%',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  color: '$gray-500',

  '& > .loader_internal': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '$4',

    svg: {
      animation: `${rotate} 600ms infinite`,
      color: '$gray-400',
    },
  },
})

export default Loader
