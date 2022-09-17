import React from "react";

export interface NextCMSContext {
  settings: string;
}

const ctxt = React.createContext({} as NextCMSContext);

export default ctxt;
