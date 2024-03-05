import { useFormItem } from '../'
import React from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { cn } from '../lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

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
export { Input }
