import { FakeP } from '@imput/components/Typography'

type FooterProps = {
  copyright: string
}

const Footer = ({ copyright }: FooterProps) => {
  return (
    <div className="relative flex justify-center items-stretch border-b border-border overflow-hidden px-4 md:px-0">
      <div
        className={`relative flex flex-col justify-center max-w-5xl w-full py-4 gap-2 bg-no-repeat`}
      >
        <FakeP className="text-slate-700">{copyright}</FakeP>
      </div>
    </div>
  )
}

export { Footer }
