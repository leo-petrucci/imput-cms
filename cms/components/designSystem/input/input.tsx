import { styled } from 'stitches.config'
import Flex from '../flex'
import Label from '../label'
import { LabelProps } from '../label/label'

const StyledInput = styled('input', {
  borderRadius: '$default',
  padding: '$2',
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
  name: string
}

const Input = ({ name, ...rest }: InputProps) => (
  <StyledInput id={name} name={name} {...rest} />
)

export default Input
