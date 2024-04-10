import { H2 } from '@imput/components/Typography'

type VideoHeadingProps = {
  heading: string
  videoSrc: string
}

const VideoHeading = ({ heading, videoSrc }: VideoHeadingProps) => {
  return (
    <div className="imp-relative imp-flex imp-justify-center imp-h-96 imp-items-center imp-border-b imp-border-border imp-overflow-hidden">
      <div className="imp-relative imp-flex imp-flex-col imp-max-w-5xl imp-w-full imp-py-4 imp-text-center imp-gap-2">
        <video playsInline autoPlay muted loop id="bgvid" className="mt-24">
          <source src={videoSrc} />
        </video>
      </div>
      <div className="imp-absolute imp-right-0 imp-left-0 imp-bottom-0 imp-flex imp-items-end imp-justify-center imp-py-4 imp-h-72 imp-bg-gradient-to-b imp-to-white imp-from-white/0">
        <div className="imp-flex imp-flex-col imp-max-w-5xl imp-w-full imp-text-center imp-gap-2">
          <H2 className="imp-text-foreground">{heading}</H2>
        </div>
      </div>
    </div>
  )
}

export { VideoHeading }
