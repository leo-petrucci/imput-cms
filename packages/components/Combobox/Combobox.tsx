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
            <div className="imp-flex imp-flex-wrap imp-gap-[2px]">
              {value.map((v) => (
                <span key={v.value} className="imp-text-sm imp-p-2">
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
          className="imp-min-w-full imp-flex imp-justify-between"
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
          className="imp-rounded-md imp-border imp-bg-popover imp-text-popover-foreground imp-shadow-md imp-outline-none data-[state=open]:imp-animate-in data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=open]:imp-fade-in-0 data-[state=closed]:imp-zoom-out-95 data-[state=open]:imp-zoom-in-95 data-[side=bottom]:imp-slide-in-from-top-2 data-[side=left]:imp-slide-in-from-right-2 data-[side=right]:imp-slide-in-from-left-2 data-[side=top]:imp-slide-in-from-bottom-2"
          style={{
            width: buttonWidth,
          }}
        >
          <Command
            className="imp-flex imp-h-full imp-w-full imp-flex-col imp-overflow-hidden imp-rounded-md imp-bg-popover imp-text-popover-foreground"
            value={value}
            onValueChange={(v) => setValue(v)}
          >
            <CommandInput
              placeholder="Type to search options"
              className="imp-flex imp-h-11 imp-w-full imp-rounded-md imp-bg-transparent imp-py-3 imp-text-sm imp-outline-none placeholder:imp-text-muted-foreground disabled:imp-cursor-not-allowed disabled:imp-opacity-50"
            />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup className="imp-overflow-hidden imp-p-1 imp-text-foreground [&_[cmdk-group-heading]]:imp-px-2 [&_[cmdk-group-heading]]:imp-py-1.5 [&_[cmdk-group-heading]]:imp-text-xs [&_[cmdk-group-heading]]:imp-font-medium [&_[cmdk-group-heading]]:imp-text-muted-foreground">
                {options.map((option) => (
                  <CommandItem
                    value={option.label}
                    className="imp-relative imp-flex imp-cursor-default imp-select-none imp-items-center imp-rounded-sm imp-px-2 imp-py-1.5 imp-text-sm imp-outline-none aria-selected:imp-bg-accent aria-selected:imp-text-accent-foreground data-[disabled]:imp-pointer-events-none data-[disabled]:imp-opacity-50"
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

const StyledIcon = cva('imp-h-4 imp-w-4')

const Combobox = Object.assign(ComboboxSingle, { Multi: ComboboxMulti })

export { Combobox }
