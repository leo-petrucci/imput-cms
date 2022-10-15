import { useContext, useEffect } from "react";
import get from "lodash/get";
import {
  FieldValues,
  FormProvider,
  RegisterOptions,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormReturn,
} from "react-hook-form";
import Box from "cms/components/designSystem/box";
import ctxt from "./context";

export interface FormProps {
  form?: UseFormReturn<FieldValues, any>;
  onSubmit: SubmitHandler<FieldValues>;
  children: React.ReactNode;
  debug?: boolean;
}

/**
 * Renders a form component managed by `react-hook-form`. Its children should be components controlled by `react-hook-form`.
 * @param form - value returned by `useForm`, if unspecified a default useform instance is used
 * @param onSubmit - callback for when form is submitted
 * @param children - components to render within the form
 * @returns
 */
const Form = ({ form, onSubmit, children, debug }: FormProps) => {
  const methods = useForm();

  const values = form ? form.watch() : methods.watch();

  useEffect(() => {
    if (debug) {
      console.log(values);
    }
  }, [values, debug]);

  return (
    <FormProvider {...{ ...(form || methods) }}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};

Form.defaultProps = {
  debug: false,
};

const FormItemContextProvider = ctxt.Provider;

/**
 * Contains information about the form item
 */
export const FormItemProvider = ({
  children,
  rules,
  name,
}: {
  children: React.ReactNode;
  rules: RegisterOptions;
  name: string;
}): JSX.Element => {
  return (
    <FormItemContextProvider value={{ rules, name }}>
      {children}
    </FormItemContextProvider>
  );
};

/**
 * Returns the form item config
 */
export const useFormItem = () => useContext(ctxt);

interface FormItemProps {
  children: React.ReactNode;
  /**
   * Label text, can either be a string or a custom component.
   */
  label: React.ReactNode | string;
  /**
   * Name of the input associated with this item
   */
  name: string;
  /**
   * (Optional) Description of the input required
   */
  description?: string;
  /**
   * Validation rules for the Form item's children
   */
  rules?: RegisterOptions;
}

/**
 * Used to wrap inputs, will render a label and errors associated with `name` passed to it.
 */
const Item = ({ name, children, label, rules = {} }: FormItemProps) => {
  const methods = useFormContext();

  return (
    <FormItemProvider rules={rules} name={name}>
      <Box
        css={{
          display: "flex",
          flexDirection: "column",
          gap: "$1",
        }}
      >
        {typeof label === "string" ? (
          <label htmlFor={name}>{label}</label>
        ) : (
          label
        )}
        <div>{children}</div>
        <div>{get(methods.formState.errors, `${name}.message`)}</div>
      </Box>
    </FormItemProvider>
  );
};

Form.Item = Item;

export default Form;
