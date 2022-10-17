import { CSS } from "@stitches/react";
import { inlineCss } from "stitches.config";

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  css: CSS;
}

const Box = ({ css, ...rest }: BoxProps) => {
  return <div {...rest} className={inlineCss(css)} />;
};

export default Box;
