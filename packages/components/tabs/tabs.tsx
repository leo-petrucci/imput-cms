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
export const Tabs = (props: ITabsProps): JSX.Element => (
  <div>
    <TabsPrimitive.Root {...omit(props, 'listProps', 'triggers', 'children')}>
      <TabsPrimitive.List
        className="imp-inline-flex imp-h-10 imp-items-center imp-justify-center imp-rounded-md imp-bg-muted p-1 imp-text-muted-foreground"
        {...props.listProps}
      >
        {props.triggers.map((triggerProps, index) => (
          <TabsPrimitive.Trigger
            className="imp-inline-flex imp-items-center imp-justify-center imp-whitespace-nowrap imp-rounded-sm imp-px-3 imp-py-1.5 imp-text-sm imp-font-medium imp-ring-offset-background imp-transition-all focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring focus-visible:imp-ring-offset-2 disabled:imp-pointer-events-none disabled:imp-opacity-50 data-[state=active]:imp-bg-background data-[state=active]:imp-text-foreground data-[state=active]:imp-shadow-sm"
            key={index}
            {...triggerProps}
          />
        ))}
      </TabsPrimitive.List>
      {props.children}
    </TabsPrimitive.Root>
  </div>
)

export interface ITabsContentProps extends TabsPrimitive.TabsContentProps {}

export const Content = (props: ITabsContentProps) => (
  <TabsPrimitive.Content
    className="imp-mt-2 imp-ring-offset-background focus-visible:imp-outline-none focus-visible:imp-ring-2 focus-visible:imp-ring-ring imp-focus-visible:imp-ring-offset-2"
    {...props}
  />
)
