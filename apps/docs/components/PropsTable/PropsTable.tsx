import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@imput/components/Popover'

const Code = (props: React.HTMLAttributes<HTMLElement>) => (
  <code
    {...props}
    className="nx-color-slate-800 nx-bg-slate-100 nx-font-mono	nx-whitespace-nowrap nx-p-0.5 nx-rounded-sm"
  />
)

const Th = (props: React.HTMLAttributes<HTMLElement>) => (
  <th {...props} className="nx-border-b nx-border-slate-300 nx-px-3 nx-py-4" />
)

type PropDef = {
  name: string
  required?: boolean
  default?: string | boolean
  type: string
  typeSimple?: string
  description?: string
}

const PropsTable = ({
  data,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  data: PropDef[]
  'aria-label'?: string
  'aria-labelledby'?: string
}) => {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <div
      aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
      aria-labelledby={ariaLabelledBy}
    >
      <table className="nx-w-full nx-text-left	nx-border-collapse nx-table">
        <thead>
          <tr>
            <Th>
              <>Prop</>
            </Th>
            <Th>
              <>Type</>
            </Th>
            <Th>
              <>Default</>
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (
              {
                name,
                type,
                required,
                default: defaultValue,
                description,
                typeSimple,
              },
              i
            ) => (
              <tr key={`${name}-${i}`}>
                <td className="nx-border-b nx-border-gray-200 nx-p-4 nx-p-3 nx-whitespace-nowrap">
                  <div className="nx-flex nx-gap-2">
                    <Code>
                      {name}
                      {required ? '*' : null}
                    </Code>
                    {description && (
                      <Popover>
                        <PopoverContent>
                          <>{description}</>
                        </PopoverContent>
                        <PopoverTrigger>
                          <button className="nx-bg-none nx-border-0 nx-p-0 nx-cursor-pointer nx-flex nx-items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <rect width="256" height="256" fill="none"></rect>
                              <circle
                                cx="128"
                                cy="128"
                                r="96"
                                fill="none"
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="16"
                              ></circle>
                              <polyline
                                points="120 120 128 120 128 176 136 176"
                                fill="none"
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="16"
                              ></polyline>
                              <circle cx="126" cy="84" r="12"></circle>
                            </svg>
                          </button>
                        </PopoverTrigger>
                      </Popover>
                    )}
                  </div>
                </td>
                <td className="nx-border-b nx-border-gray-200 nx-p-4 nx-p-3">
                  <div className="nx-flex nx-gap-2">
                    <Code className="nx-text-gray-900">
                      {Boolean(typeSimple) ? typeSimple : type}
                    </Code>
                    {Boolean(typeSimple) && (
                      <Popover>
                        <PopoverContent>
                          <Code>{type}</Code>
                        </PopoverContent>
                        <PopoverTrigger>
                          <button className="nx-bg-none nx-border-0 nx-p-0 nx-cursor-pointer nx-flex nx-items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <rect width="256" height="256" fill="none"></rect>
                              <circle
                                cx="128"
                                cy="128"
                                r="96"
                                fill="none"
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="16"
                              ></circle>
                              <polyline
                                points="120 120 128 120 128 176 136 176"
                                fill="none"
                                stroke="#000000"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="16"
                              ></polyline>
                              <circle cx="126" cy="84" r="12"></circle>
                            </svg>
                          </button>
                        </PopoverTrigger>
                      </Popover>
                    )}
                  </div>
                </td>
                <td className="nx-border-b nx-border-gray-200 nx-p-4 nx-p-3">
                  {Boolean(defaultValue) ? (
                    <Code>{defaultValue}</Code>
                  ) : (
                    <div className="nx-color-slate-700">-</div>
                  )}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PropsTable
