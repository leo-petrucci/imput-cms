import React from 'react'
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'cmdk'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverPortal,
  PopoverProps,
} from '@radix-ui/react-popover'
import useMeasure from '../utils/useMeasure'
import { styled } from '@meow/stitches'

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
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'>

type OptionType = {
  value: any
  label: string
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
const Combobox = (props: ComboboxProps & SharedComboboxProps) => {
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
}

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
const ComboboxMulti = (props: ComboboxMultiProps & SharedComboboxProps) => {
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
      value={value}
      disabled={disabled}
      options={options}
      open={open}
      onOpenChange={setOpen}
      buttonRender={
        <>
          {value.length > 0 ? (
            <div className="combobox__pillcontainer">
              {value.map((v) => (
                <span key={v.value} className="combobox__pill">
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
}

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
const ComboboxPrimtive = (
  props: ComboboxPrimitiveProps & SharedComboboxProps
) => {
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

  return (
    <StyledCombobox>
      <Popover open={open} onOpenChange={onOpenChange} modal>
        <PopoverTrigger asChild>
          <button
            data-testid="combobox"
            className="combobox__button"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            ref={ref}
            {...rest}
          >
            {buttonRender}
            <StyledIcon
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
            </StyledIcon>
          </button>
        </PopoverTrigger>
        <PopoverPortal>
          <StyledPopoverContent
            style={{
              width: buttonWidth,
            }}
          >
            <Command
              className="combobox__command"
              value={value}
              onValueChange={(v) => setValue(v)}
            >
              <CommandInput
                placeholder="Type to search options"
                className="combobox__commandinput"
              />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup className="combobox__commandgroup">
                  {options.map((option) => (
                    <CommandItem
                      value={option.label}
                      className="combobox__commanditem"
                      key={option.value}
                      onSelect={() => {
                        handleSelect(option)
                      }}
                    >
                      <StyledIcon
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
                      </StyledIcon>
                      <span>{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </StyledPopoverContent>
        </PopoverPortal>
      </Popover>
    </StyledCombobox>
  )
}

const StyledCombobox = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$4',
  alignItems: 'center',
  width: '100%',
  border: '1px solid transparent',
  fontWeight: 500,

  '& .combobox__button': {
    minWidth: '100%',
  },

  '& .combobox__pillcontainer': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '2px',
  },

  '& .combobox__pill': {
    fontSize: '$sm',
    padding: '$2',
  },
})

const StyledPopoverContent = styled(PopoverContent, {
  "&[aria-hidden='true']": {
    display: 'none',
  },

  '& .combobox__commandinput': {
    padding: '$4',
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },

  '& [cmdk-empty]': {
    padding: '$4',
    fontSize: '$sm',
    textAlign: 'center',
  },

  '& [cmdk-list]': {
    maxHeight: '170px',
    overflow: 'auto',
    msScrollChaining: 'none',
    overscrollBehavior: 'contain',
    transition: '0.1s ease',
    transitionProperty: 'height',
  },

  '& .combobox__command, & .combobox__commandgroup > div': {
    display: 'flex',
    flexDirection: 'column',
  },

  '& .combobox__commanditem': {
    display: 'flex',
    cursor: 'pointer',
    gap: '$2',
    padding: '$4',
  },
})

const StyledIcon = styled('div', {
  height: '16px',
  width: '16px',
})

Combobox.Multi = ComboboxMulti

export default Combobox
