import { H1, Lead } from '@imput/components/Typography'

type HeaderProps = {
  title: string
  subtitle: string
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="flex justify-center h-80 items-center border-b border-border">
      <div className="flex flex-col max-w-5xl w-full py-4 text-center gap-2">
        <H1 className="text-foreground">{title}</H1>
        <Lead>{subtitle}</Lead>
        <div className="self-center relative mt-8">
          <button className="bg-primary-foreground border border-border px-2 py-1 rounded">
            <code>pnpm add imput-cms</code>
          </button>
          <span className="text-xs rounded bg-blue-50 text-blue-700 p-1 absolute -right-4 -top-4">
            Alpha
          </span>
        </div>
      </div>
    </div>
  )
}

export { Header }
