import React from "react";
import { RegisterOptions } from "react-hook-form";

export interface FormItemContext {
  name: string;
  rules: RegisterOptions;
}

const ctxt = React.createContext({} as FormItemContext);

export default ctxt;
