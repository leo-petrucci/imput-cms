import { cn } from '../lib/utils'
import React from 'react'

const H1 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    {...props}
    className={cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
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
      'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
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
      'scroll-m-20 text-2xl font-semibold tracking-tight',
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
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className
    )}
  />
)

const H5 = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 {...props} className={cn('scroll-m-20 font-semibold', className)} />
)

const P = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    {...props}
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
  />
)

const FakeP = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <span {...props} className={cn('leading-7', className)} />
)

const Text = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn('leading-7', className)} />
)

const BlockQuote = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    {...props}
    className={cn('mt-6 border-l-2 pl-6 italic', className)}
  />
)

const UnorderedList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul {...props} className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} />
)

const Code = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      className
    )}
  />
)

const Lead = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p {...props} className={cn('text-xl text-muted-foreground', className)} />
)

const Large = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div {...props} className={cn('text-lg font-semibold', className)} />
)

const Small = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div
    {...props}
    className={cn('text-sm font-medium leading-none', className)}
  />
)

const Muted = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <div {...props} className={cn('text-sm text-muted-foreground', className)} />
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
