import React from 'react'
import { cn } from '../lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('imp-animate-pulse imp-rounded-md imp-bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
