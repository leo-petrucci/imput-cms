import { H1, Lead } from '@imput/components/Typography'
import React from 'react'

type HeaderProps = {
  title: string
  subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const [success, setSuccess] = React.useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText('npm install imput-cms').then(
      () => {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      },
      () => console.log('error copying text')
    )
  }

  return (
    <div className="flex justify-center h-80 items-center border-b border-border">
      <div className="flex flex-col max-w-5xl w-full py-4 text-center gap-2 px-4 md:px-0">
        <H1 className="text-foreground">{title}</H1>
        <Lead>{subtitle}</Lead>
        <div className="self-center relative mt-8">
          <button
            className="bg-primary-foreground border border-border px-2 py-1 rounded"
            onClick={copyToClipboard}
          >
            <code>npm install imput-cms</code>
          </button>
          <span className="text-xs font-medium rounded bg-blue-50 text-blue-700 p-1 absolute -right-4 -top-4">
            Alpha
          </span>
          <div className="absolute right-0 left-0 flex justify-center items-center p-2">
            {success && (
              <div
                data-state={success ? 'open' : 'closed'}
                className="px-2 py-1 text-sm rounded bg-primary text-primary-foreground shadow duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 "
              >
                Copied!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Header }
