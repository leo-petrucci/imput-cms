import { styled } from 'stitches.config'
import Flex from '../flex'
import Label from '../label'
import { LabelProps } from '../label/label'

const StyledInput = styled('input', {
  borderRadius: '$default',
  padding: '$1 $2',
  color: '$gray-800',
  boxShadow: '0 0 0 1px var(--colors-gray-300)',
  border: '1px solid transparent',
  '&:focus': {
    boxShadow: '0 0 0 2px var(--colors-primary-600)',
    outline: 'none',
  },
})

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  labelProps?: LabelProps
  label: React.ReactNode
  name: string
}

const Input = ({ label, name, labelProps, ...rest }: InputProps) => (
  <Flex direction="column" gap="1">
    <Label htmlFor={`input-${name}`} {...labelProps}>
      {label}
    </Label>
    <StyledInput id={`input-${name}`} name={name} {...rest} />
  </Flex>
)

export default Input
