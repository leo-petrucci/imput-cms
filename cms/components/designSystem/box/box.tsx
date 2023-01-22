import React from 'react'
import { inlineCss, CustomCSS } from 'stitches.config'

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  css: CustomCSS
}

const Box = React.forwardRef<JSX.Element, BoxProps>(
  ({ css, ...rest }: BoxProps, ref: any) => {
    return <div {...rest} ref={ref} className={inlineCss(css)} />
  }
)

Box.displayName = 'Box'

export default Box
