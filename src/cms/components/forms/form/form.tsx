import React, { useContext, useEffect } from 'react'
import get from 'lodash/get'
import {
  FieldValues,
  FormProvider,
  RegisterOptions,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form'
import Box from '../../../../cms/components/designSystem/box'
import ctxt from './context'
import Label from '../../../../cms/components/designSystem/label'

export interface FormProps<T extends FieldValues> {
  form?: UseFormReturn<T, any>
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  debug?: boolean
  formProps?: React.HTMLAttributes<HTMLFormElement>
}

/**
 * Renders a form component managed by `react-hook-form`. Its children should be components controlled by `react-hook-form`.
 * @param form - value returned by `useForm`, if unspecified a default useform instance is used
 * @param onSubmit - callback for when form is submitted
 * @param children - components to render within the form
 * @returns
 */
function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  debug,
  formProps,
}: FormProps<T>) {
  const methods = useForm<T>()

  const values = form ? form.watch() : methods.watch()

  React.useEffect(() => {
    if (debug) {
      console.log(values)
    }
  }, [values, debug])

  const context = { ...(form || methods) }

  return (
    <FormProvider {...context}>
      <form onSubmit={context.handleSubmit(onSubmit)} {...formProps}>
        {children}
      </form>
    </FormProvider>
  )
}

Form.defaultProps = {
  debug: false,
}

const FormItemContextProvider = ctxt.Provider

/**
 * Contains information about the form item
 */
export const FormItemProvider = ({
  children,
  rules,
  name,
}: {
  children: React.ReactNode
  rules: RegisterOptions
  name: string
}): JSX.Element => {
  return (
    <FormItemContextProvider value={{ rules, name }}>
      {children}
    </FormItemContextProvider>
  )
}

/**
 * Returns the form item config
 */
export const useFormItem = () => useContext(ctxt)

interface FormItemProps extends Partial<React.ComponentProps<typeof Box>> {
  children: React.ReactNode
  /**
   * Label text, can either be a string or a custom component.
   */
  label: React.ReactNode | string
  /**
   * Name of the input associated with this item
   */
  name: string
  /**
   * (Optional) Description of the input required
   */
  description?: string
  /**
   * Validation rules for the Form item's children
   */
  rules?: RegisterOptions
}

/**
 * Used to wrap inputs, will render a label and errors associated with `name` passed to it.
 */
const Item = ({
  name,
  children,
  label,
  rules = {},
  css,
  ...rest
}: FormItemProps) => {
  const methods = useFormContext()

  return (
    <FormItemProvider rules={rules} name={name}>
      <Box
        {...rest}
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '$1',
          ...css,
        }}
      >
        {typeof label === 'string' ? (
          <Label htmlFor={name}>{label}</Label>
        ) : (
          label
        )}
        <div>{children}</div>
        <Box
          css={{
            color: '$red-600',
          }}
        >
          {get(methods.formState.errors, `${name}.message`) as string}
        </Box>
      </Box>
    </FormItemProvider>
  )
}

Form.Item = Item

export default Form
