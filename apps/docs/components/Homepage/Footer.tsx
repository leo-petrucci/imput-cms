import { FakeP } from '@imput/components/Typography'

type FooterProps = {
  copyright: string
}

const Footer = ({ copyright }: FooterProps) => {
  return (
    <div className="imp-relative imp-flex imp-justify-center imp-items-stretch imp-border-b imp-border-border imp-overflow-hidden imp-px-4 md:imp-px-0">
      <div
        className={`imp-relative imp-flex imp-flex-col imp-justify-center imp-max-w-5xl imp-w-full imp-py-4 imp-gap-2 imp-bg-no-repeat`}
      >
        <FakeP className="imp-text-slate-700">{copyright}</FakeP>
      </div>
    </div>
  )
}

export { Footer }
