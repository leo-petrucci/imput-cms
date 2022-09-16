import React from 'react';

export interface NextCMSSettings {
  setting: string;
}

const ctxt = React.createContext(
  {} as NextCMSSettings
);

export default ctxt;