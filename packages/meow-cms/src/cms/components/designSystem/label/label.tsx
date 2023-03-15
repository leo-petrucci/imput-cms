import * as LabelPrimitive from '@radix-ui/react-label'
import { styled } from '@meow/stitches'
import React from 'react'

const StyledLabel = styled(LabelPrimitive.Root, {
  color: '$gray-800',
  textTransform: 'capitalize',
  fontWeight: '$semibold',
  fontSize: '$sm',
})

export interface LabelProps extends LabelPrimitive.LabelProps {}

const Label = (props: LabelProps) => {
  return <StyledLabel {...props} />
}

export default Label
