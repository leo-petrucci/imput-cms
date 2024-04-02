import { H2 } from '@imput/components/Typography'

type VideoHeadingProps = {
  heading: string
  videoSrc: string
}

const VideoHeading = ({ heading, videoSrc }: VideoHeadingProps) => {
  return (
    <div className="relative flex justify-center h-96 items-center border-b border-border overflow-hidden">
      <div className="relative flex flex-col max-w-5xl w-full py-4 text-center gap-2">
        <video
          playsInline
          autoPlay
          muted
          loop
          poster="polina.jpg"
          id="bgvid"
          className="-mt-32"
        >
          <source src={videoSrc} />
        </video>
      </div>
      <div className="absolute right-0 left-0 bottom-0 flex items-end justify-center py-4 h-72 bg-gradient-to-b to-white from-white/0">
        <div className="flex flex-col max-w-5xl w-full text-center gap-2">
          <H2 className="text-foreground">{heading}</H2>
        </div>
      </div>
    </div>
  )
}

export { VideoHeading }
