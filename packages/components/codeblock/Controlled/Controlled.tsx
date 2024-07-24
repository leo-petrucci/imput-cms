import React from 'react'
import BaseCodeblock, { CodeblockProps } from '../codeblock'
import { useController, useFormContext } from 'react-hook-form'
import { useFormItem } from '../../form'

export type ControlledCodeBlockProps = Omit<CodeblockProps, 'onValueChange'>

const Codeblock = ({ ...rest }: ControlledCodeBlockProps) => {
  const form = useFormContext()
  const { name, rules } = useFormItem()

  const { field } = useController({
    name: name,
    control: form.control,
    rules,
    defaultValue: rest.defaultValue || '',
  })

  return <BaseCodeblock {...rest} {...field} onValueChange={field.onChange} />
}

Codeblock.displayName = 'Codeblock'

export { Codeblock }
