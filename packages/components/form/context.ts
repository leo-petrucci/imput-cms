import React from 'react'
import { RegisterOptions } from 'react-hook-form'
import { FormItemProps } from './form'

export interface FormItemContext {
  name: string
  rules: RegisterOptions
  label: FormItemProps['label']
  setValueAs: NonNullable<FormItemProps['setValueAs']>
}

const ctxt = React.createContext({} as FormItemContext)

export default ctxt
