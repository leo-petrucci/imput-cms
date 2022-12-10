import { CSS } from '@stitches/react'
import { inlineCss, CustomCSS } from 'stitches.config'

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  css: CustomCSS
}

const Box = ({ css, ...rest }: BoxProps) => {
  return <div {...rest} className={inlineCss(css)} />
}

export default Box
