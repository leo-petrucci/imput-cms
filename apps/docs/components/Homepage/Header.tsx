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
    <div className="imp-flex imp-justify-center imp-h-80 imp-items-center imp-border-b imp-border-border">
      <div className="imp-flex imp-flex-col imp-max-w-5xl imp-w-full imp-py-4 imp-text-center imp-gap-2 imp-px-4 md:imp-px-0">
        <H1 className="imp-text-foreground">{title}</H1>
        <Lead>{subtitle}</Lead>
        <div className="imp-self-center imp-relative imp-mt-8">
          <button
            className="imp-bg-primary-foreground imp-border imp-border-border imp-px-2 imp-py-1 imp-rounded"
            onClick={copyToClipboard}
          >
            <code>npm install imput-cms</code>
          </button>
          <span className="imp-text-xs imp-font-medium imp-rounded imp-bg-blue-50 imp-text-blue-700 imp-p-1 imp-absolute -imp-right-4 -imp-top-4">
            Alpha
          </span>
          <div className="imp-absolute imp-right-0 imp-left-0 imp-flex imp-justify-center imp-items-center imp-p-2">
            {success && (
              <div
                data-state={success ? 'open' : 'closed'}
                className="imp-px-2 imp-py-1 text-sm imp-rounded imp-bg-primary imp-text-primary-foreground imp-shadow imp-duration-200 data-[state=open]:imp-animate-in data-[state=closed]:imp-animate-out data-[state=closed]:imp-fade-out-0 data-[state=open]:imp-fade-in-0 data-[state=closed]:imp-zoom-out-95 data-[state=open]:imp-zoom-in-95 "
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
