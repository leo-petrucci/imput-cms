import { cn } from '../lib/utils'
import React from 'react'

const H1 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    {...props}
    className={cn(
      'imp-scroll-m-20 imp-text-4xl imp-font-extrabold imp-tracking-tight lg:imp-text-5xl',
      className
    )}
  />
)

const H2 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    {...props}
    className={cn(
      'imp-scroll-m-20 imp-pb-2 imp-text-3xl imp-font-semibold imp-tracking-tight imp-transition-colors first:imp-mt-0',
      className
    )}
  />
)

const H3 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    {...props}
    className={cn(
      'imp-scroll-m-20 imp-text-2xl imp-font-semibold imp-tracking-tight',
      className
    )}
  />
)

const H4 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    {...props}
    className={cn(
      'imp-scroll-m-20 imp-text-xl imp-font-semibold imp-tracking-tight',
      className
    )}
  />
)

const H5 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4
    {...props}
    className={cn('imp-scroll-m-20 imp-font-semibold', className)}
  />
)

const P = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    {...props}
    className={cn('imp-leading-7 [&:not(:first-child)]:imp-mt-6', className)}
  />
)

const FakeP = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <span {...props} className={cn('imp-leading-7', className)} />
)

const Text = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn('imp-leading-7', className)} />
)

const BlockQuote = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    {...props}
    className={cn('imp-mt-6 imp-border-l-2 imp-pl-6 imp-italic', className)}
  />
)

const UnorderedList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    {...props}
    className={cn('imp-my-6 imp-ml-6 imp-list-disc [&>li]:imp-mt-2', className)}
  />
)

const Code = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    className={cn(
      'imp-relative imp-rounded imp-bg-muted imp-px-[0.3rem] imp-py-[0.2rem] imp-font-mono imp-text-sm imp-font-semibold',
      className
    )}
  />
)

const Lead = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    {...props}
    className={cn('imp-text-xl imp-text-muted-foreground', className)}
  />
)

const Large = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div {...props} className={cn('imp-text-lg imp-font-semibold', className)} />
)

const Small = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div
    {...props}
    className={cn('imp-text-sm imp-font-medium imp-leading-none', className)}
  />
)

const Muted = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div
    {...props}
    className={cn('imp-text-sm imp-text-muted-foreground', className)}
  />
)

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
