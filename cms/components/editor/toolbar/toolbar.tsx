import React from "react";
import Box from "../../designSystem/box";

interface BaseProps {
  className: string;
  [key: string]: unknown;
}

const Toolbar = React.forwardRef(
  ({ className, ...props }: React.PropsWithChildren<BaseProps>) => (
    <Box
      {...props}
      css={{
        position: "relative",
        padding: "$2 $2",
        marginBottom: "$2",
        borderBottom: "1px solid $gray-200",
        display: "flex"
      }}
    />
  )
);

export default Toolbar;
