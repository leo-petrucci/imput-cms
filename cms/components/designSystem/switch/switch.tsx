import * as SwitchPrimitive from '@radix-ui/react-switch'
import { omit } from 'lodash'
import { styled } from 'stitches.config'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  width: 42,
  height: 25,
  backgroundColor: '$gray-200',
  borderRadius: '9999px',
  position: 'relative',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  '&:focus': { boxShadow: `0 0 0 2px black` },
  '&[data-state="checked"]': { backgroundColor: '$primary-500' },
})

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  width: 21,
  height: 21,
  backgroundColor: 'white',
  borderRadius: '9999px',
  transition: 'transform 100ms',
  transform: 'translateX(2px)',
  willChange: 'transform',
  '&[data-state="checked"]': { transform: 'translateX(19px)' },
})

export interface SwitchProps extends SwitchPrimitive.SwitchProps {}

const Switch = (props: SwitchProps) => (
  <StyledSwitch {...props}>
    <StyledThumb />
  </StyledSwitch>
)

export default Switch
