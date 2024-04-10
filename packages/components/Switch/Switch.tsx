import * as SwitchPrimitives from '@radix-ui/react-switch'
import { useFormItem } from '..'
import { useController, useFormContext } from 'react-hook-form'
import React from 'react'
import { cn } from '../lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'imp-peer imp-inline-flex imp-h-6 imp-w-11 imp-shrink-0 imp-cursor-pointer imp-items-center imp-rounded-full imp-border-2 imp-border-transparent imp-transition-colors focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 focus-visible:imp-ring-offset-background disabled:imp-cursor-not-allowed disabled:imp-opacity-50 data-[state=checked]:imp-bg-primary data-[state=unchecked]:imp-bg-input',
      className
    )}
    id={`switch-${props.name}`}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'imp-pointer-events-none imp-block imp-h-5 imp-w-5 imp-rounded-full imp-bg-background imp-shadow-lg imp-ring-0 imp-transition-transform data-[state=checked]:imp-translate-x-5 data-[state=unchecked]:imp-translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export interface ControlledSwitchProps
  extends React.ComponentProps<typeof Switch> {}

/**
 * An on/off switch to be used in forms
 */
const SwitchControlled = (props: ControlledSwitchProps) => {
  const form = useFormContext()
  const { rules, name } = useFormItem()

  const {
    field: { onChange: formOnchange, value, ref: _ref, ...rest },
  } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: props.defaultValue || false,
  })

  return (
    <>
      <Switch
        {...props}
        {...rest}
        onCheckedChange={formOnchange}
        checked={value}
      />
    </>
  )
}

export { Switch, SwitchControlled }
