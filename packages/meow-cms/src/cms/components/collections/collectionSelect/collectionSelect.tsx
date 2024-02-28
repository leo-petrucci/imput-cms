import { useCMS } from '../../../../cms/contexts/cmsContext/useCMSContext'
import { NavLink } from 'react-router-dom'
import React from 'react'
import { Card, CardHeader } from '@meow/components/src/Card'
import { H5 } from '@meow/components/src/Typography'

/**
 * Renders a container that lists all the different collections available
 */
const CollectionSelect = ({ baseUrl }: { baseUrl: string }) => {
  const { collections } = useCMS()
  return (
    <Card>
      <CardHeader className="p-4">Collections</CardHeader>
      <div className="flex flex-col border-t border-border divide-y divide-border">
        {collections.map((c) => (
          <NavLink
            key={c.name}
            to={`${baseUrl}/${c.name}`}
            className="flex-1 text-left px-3 py-4 bg-transparent border-0 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <H5>{c.label}</H5>
          </NavLink>
        ))}
      </div>
    </Card>
  )
}

export default CollectionSelect
