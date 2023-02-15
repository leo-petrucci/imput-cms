import React from 'react'
import Box from '../../../../cms/components/designSystem/box'

interface BaseProps {
  className?: string
  [key: string]: unknown
}

const Toolbar = ({
  className,
  ...props
}: React.PropsWithChildren<BaseProps>) => (
  <Box
    {...props}
    css={{
      position: 'sticky',
      background: 'white',
      zIndex: '$10',
      padding: '$2 $2',
      marginBottom: '$2',
      // borderBottom: "1px solid $gray-200",
      display: 'flex',
    }}
  />
)

export default Toolbar
