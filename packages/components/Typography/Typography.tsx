import { cn } from '../lib/utils'
import React from 'react'
import { Slot } from '@radix-ui/react-slot'

const H1 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h1'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-scroll-m-20 imp-text-4xl imp-font-extrabold imp-tracking-tight lg:imp-text-5xl',
        className
      )}
    />
  )
})

const H2 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h2'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-scroll-m-20 imp-pb-2 imp-text-3xl imp-font-semibold imp-tracking-tight imp-transition-colors first:imp-mt-0',
        className
      )}
    />
  )
})

const H3 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h3'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-scroll-m-20 imp-text-2xl imp-font-semibold imp-tracking-tight',
        className
      )}
    />
  )
})

const H4 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h4'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-scroll-m-20 imp-text-xl imp-font-semibold imp-tracking-tight',
        className
      )}
    />
  )
})

const H5 = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'h5'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-scroll-m-20 imp-font-semibold', className)}
    />
  )
})

const P = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'p'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-leading-7 [&:not(:first-child)]:imp-mt-6', className)}
    />
  )
})

const FakeP = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'span'
  return (
    <Comp ref={ref} {...props} className={cn('imp-leading-7', className)} />
  )
})

const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'p'
  return (
    <Comp ref={ref} {...props} className={cn('imp-leading-7', className)} />
  )
})

const BlockQuote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'blockquote'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-mt-6 imp-border-l-2 imp-pl-6 imp-italic', className)}
    />
  )
})

const UnorderedList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'ul'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-my-6 imp-ml-6 imp-list-disc [&>li]:imp-mt-2',
        className
      )}
    />
  )
})

const Code = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'code'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn(
        'imp-relative imp-rounded imp-bg-muted imp-px-[0.3rem] imp-py-[0.2rem] imp-font-mono imp-text-sm imp-font-semibold',
        className
      )}
    />
  )
})

const Lead = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'p'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-text-xl imp-text-muted-foreground', className)}
    />
  )
})

const Large = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-text-lg imp-font-semibold', className)}
    />
  )
})

const Small = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-text-sm imp-font-medium imp-leading-none', className)}
    />
  )
})

const Muted = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      ref={ref}
      {...props}
      className={cn('imp-text-sm imp-text-muted-foreground', className)}
    />
  )
})

export {
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  FakeP,
  Text,
  BlockQuote,
  UnorderedList,
  Code,
  Lead,
  Large,
  Small,
  Muted,
}
