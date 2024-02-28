import React, { useContext } from 'react'
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
import ctxt from './context'
import { Label } from '../'

export type FormProps<T extends FieldValues> = {
  form?: UseFormReturn<T, any>
  onSubmit: SubmitHandler<T>
  children: React.ReactNode
  debug?: boolean
} & Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'>

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
  ...rest
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
      <form onSubmit={context.handleSubmit(onSubmit)} {...rest}>
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
  setValueAs,
}: {
  children: React.ReactNode
  rules: RegisterOptions
  name: string
  setValueAs: FormItemProps['setValueAs']
}): JSX.Element => {
  return (
    <FormItemContextProvider value={{ rules, name, setValueAs: setValueAs! }}>
      {children}
    </FormItemContextProvider>
  )
}

/**
 * Returns the form item config
 */
export const useFormItem = () => useContext(ctxt)

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /**
   * If defined, can be used to transform value before it's saved to the form
   */
  setValueAs?: (value: string) => any
}

/**
 * Used to wrap inputs, will render a label and errors associated with `name` passed to it.
 */
const Item = ({
  name,
  children,
  label,
  rules = {},
  setValueAs = (val: string) => val,
  ...rest
}: FormItemProps) => {
  const methods = useFormContext()

  return (
    <FormItemProvider rules={rules} name={name} setValueAs={setValueAs}>
      <div className="flex flex-col gap-1" {...rest}>
        {typeof label === 'string' ? (
          <Label htmlFor={name}>{label}</Label>
        ) : (
          label
        )}
        <div>{children}</div>
        <div className="text-destructive">
          {
            get(
              methods.formState.errors,
              `${name}.message`
            ) as unknown as string
          }
        </div>
      </div>
    </FormItemProvider>
  )
}

Form.Item = Item

export default Form
