import React from 'react'

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
          {data.map(({ name, type, required, default: defaultValue }, i) => (
            <tr key={`${name}-${i}`}>
              <td className="nx-border-b nx-border-gray-200 nx-p-4 nx-p-3 nx-whitespace-nowrap">
                <div className="nx-flex nx-gap-2">
                  <Code>
                    {name}
                    {required ? '*' : null}
                  </Code>
                </div>
              </td>
              <td className="nx-border-b nx-border-gray-200 nx-p-4 nx-p-3">
                <div className="nx-flex nx-gap-2">
                  <Code className="nx-text-gray-900">{type}</Code>
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
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PropsTable
