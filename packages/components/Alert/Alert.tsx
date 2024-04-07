'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { Button } from '../Button'
import { CircleNotch } from '../Icon'

import { cn } from '../lib/utils'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const DialogCancel = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Cancel ref={ref} asChild>
    <Button {...props} />
  </DialogPrimitive.Cancel>
))
DialogCancel.displayName = DialogPrimitive.Cancel.displayName

const DialogAction = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Action>
>(({ className, children, ...props }, ref) => {
  const [loading, setLoading] = React.useState(false)

  return (
    <DialogPrimitive.Action ref={ref} asChild>
      <Button
        {...props}
        variant="destructive"
        onClick={async (e) => {
          if (props.onClick) {
            // This is the only reliable way to check if a function is asynchronous
            const onClickIsPromise =
              props.onClick.constructor.name === 'AsyncFunction'
            // We only set loading if the function is actually async
            // to avoid useless re-renders
            if (onClickIsPromise) setLoading(true)
            // We can await onclick even if it's not asynchronous
            // it won't change its behavior
            await props.onClick(e)
            if (onClickIsPromise) setLoading(false)
          }
        }}
      >
        {loading && <CircleNotch className="mr-2 h-4 w-4" />}
        {children}
      </Button>
    </DialogPrimitive.Action>
  )
})
DialogAction.displayName = DialogPrimitive.Action.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogAction,
  DialogCancel,
}
