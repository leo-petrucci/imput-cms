import { FakeP, H2, H3 } from '@imput/components/Typography'

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
    <div className="relative flex justify-center h-64 items-stretch border-b border-border overflow-hidden">
      <div
        className={`relative flex flex-col justify-center max-w-5xl w-full py-4 gap-2 bg-no-repeat ${direction === 'ltr' ? `bg-right` : `bg-left`}`}
        style={{
          backgroundImage: `url(${imageSrc})`,
        }}
      >
        <div
          className={`max-w-[50%] w-full ${direction === 'ltr' ? `self-start` : `self-end`}`}
        >
          <H3 className="text-foreground">{title}</H3>
          <FakeP className="text-slate-700">{children}</FakeP>
        </div>
      </div>
    </div>
  )
}

export { ImageTextSection }
