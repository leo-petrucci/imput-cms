import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { omit } from 'lodash'
import { styled } from '@meow/stitches'

export interface ITabsProps extends TabsPrimitive.TabsProps {
  children: React.ReactNode
  listProps?: TabsPrimitive.TabsListProps
  triggers: TabsPrimitive.TabsTriggerProps[]
}

const StyledRoot = styled(TabsPrimitive.Root, {
  display: 'flex',
  flexDirection: 'column',
  margin: '$4 0',
})

const StyledList = styled(TabsPrimitive.List, {
  display: 'flex',
  flexShrink: 0,
  borderBottom: 1,
  borderColor: '$gray-200',
  gap: '$4',
  flexWrap: 'wrap',
})

const StyledTrigger = styled(TabsPrimitive.Trigger, {
  alignItems: 'center',
  justifyContent: 'center',
  height: '3rem',
  padding: '0 1.25rem',
  fontSize: '$base',
  color: '$gray-500',
  userSelect: 'none',
  fontWeight: '$semibold',
  borderRadius: '$md',

  "&[data-state='inactive']:hover": {
    color: '$primary-800',
    background: '$primary-100',
  },

  "&[data-state='active']": {
    color: '$primary-800',
    background: '$gray-100',
  },
})

/**
 * Create a Tabs component. Uses RadixUI Tabs component.
 * https://www.radix-ui.com/docs/primitives/components/tabs
 */
const Tabs = (props: ITabsProps): JSX.Element => (
  <StyledRoot {...omit(props, 'listProps', 'triggers', 'children')}>
    <StyledList {...props.listProps}>
      {props.triggers.map((triggerProps, index) => (
        <StyledTrigger key={index} {...triggerProps} />
      ))}
    </StyledList>
    {props.children}
  </StyledRoot>
)

export interface ITabsContentProps extends TabsPrimitive.TabsContentProps {}

const StyledContent = styled(TabsPrimitive.Content, {
  padding: '0 $4',
  marginTop: '$4',
})

const Content = (props: ITabsContentProps) => (
  <StyledContent className="mt-2" {...props} />
)

Tabs.Content = Content

export default Tabs
