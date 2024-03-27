import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { SpuntareProps } from '@ironeko/spuntare'
import { useMeasure } from '@imput/utils'

import { cn } from '../lib/utils'

const AnimatedContent = motion(DialogPrimitive.Content)
const AnimatedOverlay = motion(DialogPrimitive.Overlay)

type ExtendedDialogContents = DialogPrimitive.DialogContentProps &
  HTMLMotionProps<'div'>

export interface ModalProps extends ExtendedDialogContents {
  children?: React.ReactNode
  rootProps?: DialogPrimitive.DialogProps
  overlayProps?: DialogPrimitive.DialogOverlayProps & HTMLMotionProps<'div'>
  closeProps?: DialogPrimitive.DialogCloseProps
  descriptionProps?: DialogPrimitive.DialogDescriptionProps
  title?: string
  description?: (
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode
  headingContent?: React.ReactNode
}

type ExtendedModalProps = Omit<SpuntareProps, 'open'> & ModalProps

export const Modal = ({
  children,
  title,
  description,
  rootProps,
  overlayProps,
  closeProps,
  descriptionProps,
  headingContent,
  className,
  ...rest
}: ModalProps) => {
  const [open, setOpen] = React.useState(false)

  const [headingRef, { height: headingHeight }] = useMeasure()

  return (
    <DialogPrimitive.Root
      {...rootProps}
      open={open}
      onOpenChange={(open) => {
        setOpen(open)
        rootProps?.onOpenChange?.(open)
      }}
    >
      {children !== undefined && (
        <DialogPrimitive.Trigger
          onClick={() => {
            setOpen(true)
          }}
          asChild
        >
          {children}
        </DialogPrimitive.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* @ts-ignore */}
            {rest.depth !== undefined ? (
              <></>
            ) : (
              <AnimatedOverlay
                className="fixed inset-0 bg-black/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...overlayProps}
              />
            )}
            <AnimatedContent
              className={cn(
                'fixed top-1/2 left-1/2 w-full max-w-lg border bg-background shadow-lg sm:rounded-lg origin-center flex flex-col',
                className
              )}
              style={{
                willChange: 'transform',
              }}
              initial={{
                opacity: 0,
                transform: `translate(-50%, -50%) scale(0.9) translateY(0) translateZ(0.0001px)`,
              }}
              animate={{
                opacity: 1,
                transform: `translate(-50%, -50%) scale(1) translateY(0) translateZ(0px)`,
              }}
              exit={{
                opacity: 0,
                transform: `translate(-50%, -50%) scale(0.9) translateY(0) translateZ(0.0001px)`,
              }}
              {...rest}
            >
              <div
                ref={headingRef}
                className="flex flex-col space-y-1.5 text-center sm:text-left"
              >
                <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight pt-6 px-4">
                  {title}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  {headingContent}
                </DialogPrimitive.Description>
              </div>{' '}
              <div
                style={{
                  overflowY: 'scroll',
                  maxHeight: `calc(100vh - ${headingHeight}px - 4rem)`,
                }}
              >
                {description?.(open, setOpen)}
              </div>
              <DialogPrimitive.Close asChild>
                <button
                  className="absolute w-4 h-4 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <span className="sr-only">Close</span>
                </button>
              </DialogPrimitive.Close>
            </AnimatedContent>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

const ExtendedModal = ({
  depthOfType,
  lengthOfType,
  ...props
}: ExtendedModalProps) => {
  return (
    <Modal
      initial={{
        opacity: 0,
        transform: `scale(1) translateX(-25%) translateX(0px)`,
      }}
      animate={{
        opacity: 1,
        transform: `translate(-50%, -50%) scale(${
          1 - depthOfType * (0.2 / lengthOfType)
        }) translateY(-${
          depthOfType * (50 / lengthOfType)
        }px) translateZ(0.0000px)`,
        filter: props.depth > 0 ? 'blur(2px)' : 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        transform: `scale(1)  translateX(-25%) translateX(0)`,
      }}
      style={{
        transformOrigin: props.depth > 0 ? 'top' : 'center',
      }}
      overlayProps={{
        animate: { opacity: props.depth === 0 ? 1 : 0 },
      }}
      {...props}
    />
  )
}

export default ExtendedModal
