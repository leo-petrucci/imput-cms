import React from 'react'
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../Command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverPortal,
  PopoverProps,
} from '@radix-ui/react-popover'
import useMeasure from '../utils/useMeasure'
import { Button } from '../Button'
import { cva } from 'class-variance-authority'

/**
 * Props shared by both single and multi combobox
 */
export type SharedComboboxProps = {
  /**
   * String displayed before anything is selected
   */
  placeholder?: string
  /**
   * A list of option the user can select from. `value` needs to be unique.
   */
  options: OptionType[]
  /**
   * Disable the combobox
   */
  disabled?: boolean
} & Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'defaultValue'
>

type OptionType = {
  value: any
  label: any
}

/**
 * Props used exclusively by the single combobox
 */
export interface ComboboxProps {
  /**
   * A value that matches a value in the `options`
   */
  defaultValue?: any
  /**
   * For controlling the value of the combobox externally.
   */
  value?: any
  /**
   * Callback called on value select
   */
  onSelect?: (option: OptionType) => void
  /**
   * Callback called whenever the selected value changes
   */
  onValueChange?: (value: OptionType | undefined) => void
}

/**
 * A combobox element that allows selecting one value
 */
const ComboboxSingle = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimtive> & {
    Multi: typeof ComboboxMulti
  },
  ComboboxProps & SharedComboboxProps
>((props: ComboboxProps & SharedComboboxProps, ref) => {
  const {
    disabled = false,
    options,
    placeholder,
    defaultValue,
    value: externalValue,
    onSelect,
    onValueChange,
    ...rest
  } = props
  const [open, setOpen] = React.useState(false)

  const [value, setValue] = React.useState<OptionType | undefined>(() => {
    if (externalValue !== undefined) {
      return options.find((o) => o.value === externalValue)
    } else if (defaultValue !== undefined) {
      return options.find((o) => o.value === defaultValue)
    }
    return undefined
  })

  /**
   * If value prop changes, this will update the internal state
   */
  React.useEffect(() => {
    if (externalValue) setValue(options.find((o) => o.value === externalValue))
  }, [externalValue])

  /**
   * Runs every time the value changes
   */
  React.useEffect(() => {
    onValueChange?.(value)
  }, [value])

  /**
   * Handles selection events, different logic if `isMulti` is enabled
   */
  const handleSelect = (option: OptionType) => {
    // assign types
    const v = value
    // remove if already selected, select if not
    setValue(v && v.value === option.value ? undefined : option)
    setOpen(false)
  }

  /**
   * Returns boolean depending if option === value
   */
  const handleIconOpacity = (option: OptionType) => {
    if (!value) return false
    return value.value === option.value ? true : false
  }

  return (
    <ComboboxPrimtive
      ref={ref}
      disabled={disabled}
      value={value}
      options={options}
      open={open}
      onOpenChange={setOpen}
      buttonRender={
        <>
          {value !== undefined ? (
            value.label
          ) : (
            <div className="combobox__placeholder">
              {placeholder || 'Select option...'}
            </div>
          )}
        </>
      }
      handleSelect={(option) => {
        handleSelect(option)
        onSelect?.(option)
      }}
      handleIconOpacity={handleIconOpacity}
      {...rest}
    />
  )
})

/**
 * Props used exclusively by the single combobox
 */
export interface ComboboxMultiProps {
  defaultValue?: any[]
  /**
   * For controlling the value of the combobox externally.
   */
  value?: any[]
  /**
   * Callback called on value select
   */
  onSelect?: (option: OptionType) => void
  /**
   * Callback called whenever the selected values change
   */
  onValueChange?: (value: OptionType[]) => void
}

/**
 * A combobox element that allows selecting multiple values
 */
const ComboboxMulti = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimtive>,
  ComboboxMultiProps & SharedComboboxProps
>((props: ComboboxMultiProps & SharedComboboxProps, forwardedRef) => {
  const {
    disabled = false,
    options,
    placeholder,
    value: externalValue,
    defaultValue,
    onSelect,
    onValueChange,
    ...rest
  } = props

  const [open, setOpen] = React.useState(false)

  const [value, setValue] = React.useState<OptionType[]>(() => {
    if (externalValue) {
      return externalValue.map((d) => options.find((o) => o.value === d)!)
    } else if (defaultValue) {
      return defaultValue.map((d) => options.find((o) => o.value === d)!)
    }
    return []
  })

  /**
   * If value prop changes, this will update the internal state
   */
  React.useEffect(() => {
    if (externalValue)
      setValue(externalValue.map((d) => options.find((o) => o.value === d)!))
  }, [externalValue])

  /**
   * Runs every time the value changes
   */
  React.useEffect(() => {
    onValueChange?.(value)
  }, [value])

  /**
   * Handles selection events, different logic if `isMulti` is enabled
   */
  const handleSelect = (option: OptionType) => {
    // assign types
    // if value is already selected, unselect it
    if (value.map((v) => v.value).includes(option.value)) {
      setValue(value.filter((v) => v.value !== option.value))
      // otherwise add it to selection
    } else {
      setValue([...value, option])
    }
  }

  /**
   * Returns boolean depending if option === value
   */
  const handleIconOpacity = (option: OptionType) => {
    return value.map((v) => v.value).includes(option.value)
  }

  return (
    <ComboboxPrimtive
      ref={forwardedRef}
      value={value}
      disabled={disabled}
      options={options}
      open={open}
      onOpenChange={setOpen}
      buttonRender={
        <>
          {value.length > 0 ? (
            <div className="flex flex-wrap gap-[2px]">
              {value.map((v) => (
                <span key={v.value} className="text-sm p-2">
                  {v.label}
                </span>
              ))}
            </div>
          ) : (
            <div className="combobox__placeholder">
              {placeholder || 'Select option...'}
            </div>
          )}
        </>
      }
      handleSelect={(option) => {
        handleSelect(option)
        onSelect?.(option)
      }}
      handleIconOpacity={handleIconOpacity}
      {...rest}
    />
  )
})

interface ComboboxPrimitiveProps {
  buttonRender: React.ReactNode
  handleSelect: (option: OptionType) => void
  value: OptionType | OptionType[] | undefined
  open: boolean
  onOpenChange: PopoverProps['onOpenChange']
  handleIconOpacity: (option: OptionType) => boolean
}

/**
 * This is a combobox template, it helps with not duplicating tags and component logic
 * while still being customisable enough for both Single and Multi combobox to use it
 */
export const ComboboxPrimtive = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  ComboboxPrimitiveProps & SharedComboboxProps
>((props: ComboboxPrimitiveProps & SharedComboboxProps, forwardedRef) => {
  const {
    disabled = false,
    options,
    handleSelect,
    open,
    onOpenChange,
    buttonRender,
    handleIconOpacity,
    value: _,
    ...rest
  } = props
  const [value, setValue] = React.useState('')

  const [ref, { width: buttonWidth }] = useMeasure()

  // @ts-ignore
  React.useImperativeHandle(forwardedRef, () => ref.current!, [])

  return (
    <Popover open={open} onOpenChange={onOpenChange} modal>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          data-testid="combobox"
          className="min-w-full flex justify-between"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          {...rest}
        >
          {buttonRender}
          <div
            className={StyledIcon()}
            style={{
              marginLeft: '.5rem',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              aria-hidden="true"
            >
              <rect width="256" height="256" fill="none" />
              <polyline
                points="80 176 128 224 176 176"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
              <polyline
                points="80 80 128 32 176 80"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="24"
              />
            </svg>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          className="rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          style={{
            width: buttonWidth,
          }}
        >
          <Command
            className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
            value={value}
            onValueChange={(v) => setValue(v)}
          >
            <CommandInput
              placeholder="Type to search options"
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    key={option.value}
                    onSelect={() => {
                      handleSelect(option)
                    }}
                  >
                    <div
                      className={`${StyledIcon()} mr-2`}
                      style={{
                        opacity: handleIconOpacity(option) ? 1 : 0,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                      >
                        <rect width="256" height="256" fill="none" />
                        <polyline
                          points="40 144 96 200 224 72"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="24"
                        />
                      </svg>
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  )
})

const StyledIcon = cva('h-4 w-4')

const Combobox = Object.assign(ComboboxSingle, { Multi: ComboboxMulti })

export { Combobox }
