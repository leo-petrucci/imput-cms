import * as SwitchPrimitive from '@radix-ui/react-switch'
import { useFormItem } from '../../../../cms/components/forms/form/form'
import { useController, useFormContext } from 'react-hook-form'
import { styled } from '../../../../stitches.config'
import React from 'react'

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

export interface ControlledSwitchProps extends SwitchProps {}

/**
 * An on/off switch to be used in forms
 */
const Controlled = (props: ControlledSwitchProps) => {
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

Switch.Controlled = Controlled

export default Switch
