import { Label } from '@imput/components/Label'
import { Input } from '@imput/components/Input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@imput/components/Popover'
import { Path, Transforms } from 'slate'
import { LinkElement } from '../../../../../types/slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { useEffect, useState } from 'react'
import { Button } from '@imput/components/Button'
import { focusAndRestoreSelection } from '../../../store'

/**
 * The popover that appears when editing a link
 */
export const LinkPopover = ({
  element,
  path,
  children,
  selected,
}: {
  element: LinkElement
  path: Path
  children: JSX.Element
  selected: boolean
}) => {
  const editor = useSlateStatic() as ReactEditor
  const [open, setOpen] = useState(false)

  const doOpen = () => {
    setOpen(true)
  }

  const doClose = () => {
    setOpen(false)
    focusAndRestoreSelection(editor)
  }

  /**
   * This means we can open the popover when the slate
   * cursor is over the element
   */
  useEffect(() => {
    setOpen(selected)
  }, [selected])

  return (
    <Popover open={open}>
      <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="imp-flex imp-flex-1">
          <div className="imp-flex imp-flex-col imp-gap-1 imp-flex-1">
            <Label htmlFor={`image-title`}>Url</Label>
            <Input
              name="image-title"
              defaultValue={element.url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                Transforms.setNodes<any>(
                  editor,
                  {
                    url: value,
                  },
                  {
                    at: path,
                  }
                )
              }}
            />
            <Button variant={'secondary'} size={'sm'} onClick={doClose}>
              Done
            </Button>
          </div>
        </div>
      </PopoverContent>
      <PopoverTrigger asChild onClick={doOpen}>
        {children}
      </PopoverTrigger>
    </Popover>
  )
}
