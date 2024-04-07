import { Button } from '@imput/components/Button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@imput/components/Collapsible'
import { FileImage, FolderNotch, FolderNotchOpen } from '@imput/components/Icon'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'

const Sidebar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = React.useState(true)
  const { collections } = useCMS()
  const params = useParams<{ cms: string }>()
  return (
    <div className="sticky top-0 pt-2 flex flex-col gap-2">
      <Collapsible className="space-y-1" open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
              {isOpen ? (
                <FolderNotchOpen className="mr-2 h-4 w-4" weight="bold" />
              ) : (
                <FolderNotch className="mr-2 h-4 w-4" weight="bold" />
              )}
              Collections
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="flex flex-col gap-1 ml-2">
          {collections.map((c) => (
            <Button
              key={c.name}
              variant="ghost"
              className={`w-full justify-start ${location.pathname === `/${params.cms}/${c.name}` ? 'bg-accent' : ''}`}
              onClick={() => {
                navigate(`/${params.cms}/${c.name}`)
              }}
            >
              {c.label}
            </Button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Button
        variant="ghost"
        className={`w-full justify-start ${location.pathname === `/${params.cms}/files` ? 'bg-accent' : ''}`}
        onClick={() => {
          navigate(`/${params.cms}/files`)
        }}
      >
        <FileImage className="w-4 h-4 mr-2" weight="bold" />
        Files
      </Button>
    </div>
  )
}

export { Sidebar }
