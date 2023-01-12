import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { blackA, grayA, mauve, whiteA } from '@radix-ui/colors'
import { CSS, styled } from '@stitches/react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { SpuntareProps } from '@ironeko/spuntare'
import { inlineCss } from 'stitches.config'

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: grayA.grayA6,
  // backdropFilter: 'blur(1px)',
  position: 'fixed',
  inset: 0,
})

const StyledContent = styled(DialogPrimitive.Content, {
  backgroundColor: 'white',
  borderRadius: 6,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  transformOrigin: 'center',
  padding: 25,
  '&:focus': { outline: 'none' },
})

const StyledTitle = styled(DialogPrimitive.Title, {
  margin: 0,
  fontWeight: 500,
  color: mauve.mauve12,
  fontSize: 17,
  textAlign: 'center',
  marginBottom: '$4',
})

const StyledDescription = styled(DialogPrimitive.Description, {
  // color: blackA.blackA11,
  // fontSize: 15,
  // lineHeight: 1.5,
})

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '.25em',
  display: 'inline-flex',
  padding: 4,
  alignItems: 'center',
  height: 20,
  width: 20,
  justifyContent: 'center',
  color: blackA.blackA11,
  position: 'absolute',
  top: 10,
  right: 10,
  cursor: 'pointer',

  '&:hover': { backgroundColor: blackA.blackA3 },
  '&:focus': { boxShadow: `0 0 0 2px ${blackA.blackA7}` },
})

const MotionStyledOverlay = motion(StyledOverlay)

type ExtendedDialogContents = DialogPrimitive.DialogContentProps &
  HTMLMotionProps<'div'>

export interface ModalProps extends ExtendedDialogContents {
  children?: React.ReactNode
  rootProps?: DialogPrimitive.DialogProps
  overlayProps?: DialogPrimitive.DialogOverlayProps & HTMLMotionProps<'div'>
  closeProps?: DialogPrimitive.DialogCloseProps
  descriptionProps?: DialogPrimitive.DialogDescriptionProps
  title?: string
  css?: CSS
  description?: (
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode
}

type ExtendedModalProps = Omit<SpuntareProps, 'open'> & ModalProps

export const Modal = ({
  children,
  title,
  description,
  css,
  rootProps,
  overlayProps,
  closeProps,
  descriptionProps,
  ...rest
}: ModalProps) => {
  const [open, setOpen] = React.useState(false)

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
            <MotionStyledOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              {...overlayProps}
            />
            <StyledContent asChild>
              {/* @ts-ignore */}
              <motion.div
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
                className={css ? inlineCss(css) : ''}
                {...rest}
              >
                {title !== undefined && <StyledTitle>{title}</StyledTitle>}
                <StyledDescription {...descriptionProps} asChild>
                  <div>{description?.(open, setOpen)}</div>
                </StyledDescription>
                <DialogPrimitive.Cancel asChild>
                  <IconButton
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
                  </IconButton>
                </DialogPrimitive.Cancel>
              </motion.div>
            </StyledContent>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

const ExtendedModal = (props: ExtendedModalProps) => {
  return (
    <Modal
      initial={{
        opacity: 0,
        transform: `scale(1) translateX(-25%) translateX(0px)`,
      }}
      animate={{
        opacity: 1,
        transform: `translate(-50%, -50%) scale(${
          1 - props.depthOfType * (0.2 / props.lengthOfType)
        }) translateY(-${
          props.depthOfType * (50 / props.lengthOfType)
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
