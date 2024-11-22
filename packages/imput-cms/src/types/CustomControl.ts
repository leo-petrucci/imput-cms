import { FieldValues, UseFormReturn } from 'react-hook-form'

export type CustomControlProps = {
  useFormContext: () => UseFormReturn<FieldValues, any, FieldValues>
}
