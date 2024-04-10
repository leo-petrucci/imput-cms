import { FakeP, H3 } from '@imput/components/Typography'

type ImageTextSectionProps = {
  title: string
  children: React.ReactNode
  imageSrc: string
  direction: 'ltr' | 'rtl'
}

const ImageTextSection = ({
  title,
  children,
  imageSrc,
  direction,
}: ImageTextSectionProps) => {
  return (
    <div className="imp-relative imp-flex imp-justify-center imp-h-64 imp-items-stretch imp-border-b imp-border-border imp-overflow-hidden">
      <div
        className={`imp-@container imp-relative imp-flex imp-flex-col imp-justify-center imp-max-w-5xl imp-w-full imp-gap-2 imp-bg-no-repeat ${direction === 'ltr' ? `imp-bg-right` : `imp-bg-left`}`}
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      >
        <div
          className={` imp-flex imp-flex-col imp-justify-center imp-py-4 imp-px-4 @3xl:imp-px-0 imp-max-w-[100%] @3xl:imp-max-w-[50%] imp-flex-1 imp-w-full ${direction === 'ltr' ? `imp-self-start` : `imp-self-end`} imp-bg-white/50 @3xl:imp-bg-transparent`}
        >
          <H3 className="imp-text-foreground">{title}</H3>
          <FakeP className="imp-text-slate-700">{children}</FakeP>
        </div>
      </div>
    </div>
  )
}

export { ImageTextSection }
