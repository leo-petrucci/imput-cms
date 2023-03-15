import { useFormItem } from '../../../../cms/components/forms/form/form'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { styled } from '../../../../../stitches.config'

const StyledInput = styled('input', {
  borderRadius: '$default',
  padding: '$2',
  color: '$gray-800',
  width: '100%',
  boxShadow: '0 0 0 1px var(--colors-gray-300)',
  border: '1px solid transparent',
  '&:focus': {
    boxShadow: '0 0 0 2px var(--colors-primary-600)',
    outline: 'none',
  },
})

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

// eslint-disable-next-line react/display-name
const Input = React.forwardRef<
  HTMLInputElement & {
    Controlled: JSX.Element
  },
  InputProps
>((props: InputProps, ref: any) => <StyledInput {...props} ref={ref} />)

export interface ControlledInputProps extends InputProps {}

const Controlled = ({ ...rest }: ControlledInputProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: rest.defaultValue,
  })

  return <Input {...rest} {...field} />
}

const InputNamespace = Object.assign(Input, { Controlled })

export default InputNamespace
