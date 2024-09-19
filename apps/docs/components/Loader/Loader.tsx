import React from 'react'
import { CircleNotch } from '@imput/components/Icon'

export interface LoaderProps {
  children?: React.ReactNode
}

const Loader = ({ children }: LoaderProps) => {
  return (
    <div className="imp-h-screen imp-w-full imp-flex imp-items-center imp-justify-center imp-text-primary">
      <div className="imp-flex imp-flex-col imp-items-center imp-gap-4">
        <CircleNotch size={24} weight="bold" className="imp-animate-spin	" />
        {children || 'Getting your content ready...'}
      </div>
    </div>
  )
}

export default Loader
