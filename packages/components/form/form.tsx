import React, { useContext } from 'react'
import get from 'lodash/get'
import {
  FieldValues,
  FormProvider,
  RegisterOptions,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form'
import ctxt from './context'
import { Label } from '../Label'
import { Button } from '../Button'
import { Minus, Plus } from '../Icon'

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

export interface FormItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
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
      <div className="imp-flex imp-flex-col imp-gap-1" {...rest}>
        {typeof label === 'string' ? (
          <Label htmlFor={`input-${name}`}>{label}</Label>
        ) : (
          label
        )}
        <div>{children}</div>
        <div className="imp-text-destructive">
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

/**
 * Used to wrap array inputs.
 */
const ItemField = ({
  name,
  children,
  label,
  rules = {},
  setValueAs = (val: string) => val,
  ...rest
}: FormItemProps) => {
  const methods = useFormContext()
  const fieldArray = useFieldArray({
    control: methods.control,
    name,
  })

  /**
   * Initialise to at least one item
   */
  React.useEffect(() => {
    if (fieldArray.fields.length === 0) {
      fieldArray.append('')
    }
  }, [])

  return (
    <div className="imp-flex imp-flex-col imp-gap-1" {...rest}>
      {typeof label === 'string' ? (
        <Label htmlFor={`input-${name}`}>{label}</Label>
      ) : (
        label
      )}
      {fieldArray.fields.map((field, index) => (
        <FormItemProvider
          key={field.id}
          rules={rules}
          name={`${name}.${index}`}
          setValueAs={setValueAs}
        >
          <div className="imp-flex imp-flex-1 imp-gap-1">
            <div className="flex-1">{children}</div>
            <Button
              type="button"
              className="imp-self-center"
              size="icon"
              onClick={() => {
                fieldArray.remove(index)
              }}
            >
              <Minus className="imp-w-4 imp-h-4" />
            </Button>
          </div>
        </FormItemProvider>
      ))}
      <div className="imp-flex imp-flex-col imp-flex-1 imp-mt-1">
        <Button
          type="button"
          className="imp-self-center"
          size="sm"
          onClick={() => {
            fieldArray.append('')
          }}
        >
          <Plus className="imp-w-4 imp-h-4 imp-mr-1" /> Add item
        </Button>
      </div>
      <div className="imp-text-destructive">
        {get(methods.formState.errors, `${name}.message`) as unknown as string}
      </div>
    </div>
  )
}

Form.ItemField = ItemField

export default Form
