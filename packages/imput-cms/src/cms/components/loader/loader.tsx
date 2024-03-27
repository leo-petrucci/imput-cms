import React from 'react'
import { CircleNotch } from 'phosphor-react'

export interface LoaderProps {
  children?: React.ReactNode
}

const Loader = ({ children }: LoaderProps) => {
  return (
    <div className="h-screen w-full flex items-center justify-center text-primary">
      <div className="flex flex-col items-center gap-4">
        <CircleNotch size={24} weight="bold" className="animate-spin	" />
        {children || 'Getting your content ready...'}
      </div>
    </div>
  )
}

export default Loader
