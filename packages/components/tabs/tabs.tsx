import React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import omit from 'lodash/omit'

export interface ITabsProps extends TabsPrimitive.TabsProps {
  children: React.ReactNode
  listProps?: TabsPrimitive.TabsListProps
  triggers: TabsPrimitive.TabsTriggerProps[]
}

/**
 * Create a Tabs component. Uses RadixUI Tabs component.
 * https://www.radix-ui.com/docs/primitives/components/tabs
 */
const Tabs = (props: ITabsProps): JSX.Element => (
  <TabsPrimitive.Root {...omit(props, 'listProps', 'triggers', 'children')}>
    <TabsPrimitive.List
      className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
      {...props.listProps}
    >
      {props.triggers.map((triggerProps, index) => (
        <TabsPrimitive.Trigger
          className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          key={index}
          {...triggerProps}
        />
      ))}
    </TabsPrimitive.List>
    {props.children}
  </TabsPrimitive.Root>
)

export interface ITabsContentProps extends TabsPrimitive.TabsContentProps {}

const Content = (props: ITabsContentProps) => (
  <TabsPrimitive.Content
    className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    {...props}
  />
)

Tabs.Content = Content

export default Tabs
