import { ReactEditor } from 'slate-react'
import { useCommands } from './hook'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@imput/components/Popover'
import { Portal } from '@imput/components/Portal'
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@imput/components/Command'
import { options } from './Item'

type FloatingCommandsProps = {
  editor: ReactEditor
}

export const FloatingCommands = ({ editor }: FloatingCommandsProps) => {
  const { open, position, setOpen, setClosed } = useCommands(editor)

  return (
    <>
      <Popover open={open} modal>
        <Portal.Root>
          <PopoverAnchor asChild>
            <div
              id="floating-command-position"
              className="imp-pointer-events-none imp-bg-red-600"
              style={{
                height: 20,
                width: 2,
                left: position?.left || 0,
                top: position?.top || 0,
                position: 'absolute',
              }}
            ></div>
          </PopoverAnchor>
        </Portal.Root>
        <PopoverContent
          side="top"
          className="!imp-p-0 imp-w-auto"
          onPointerDownOutside={setClosed}
          onEscapeKeyDown={setClosed}
        >
          <Command>
            <CommandInput placeholder="Type to search options" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    value={option.value}
                    key={option.value}
                    onSelect={() => {
                      option.onSelect(editor)
                      setClosed()
                    }}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
