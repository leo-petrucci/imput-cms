import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { blackA, mauve } from '@radix-ui/colors'
import { styled } from '@stitches/react'
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion'
import { SpuntareProps } from '@ironeko/spuntare'

const StyledOverlay = styled(DialogPrimitive.Overlay, {
  backgroundColor: blackA.blackA9,
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
})

const StyledDescription = styled(DialogPrimitive.Description, {
  // color: blackA.blackA11,
  // fontSize: 15,
  // lineHeight: 1.5,
})

const IconButton = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  borderRadius: '100%',
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
  description?: React.ReactNode
}

type ExtendedModalProps = Omit<SpuntareProps, 'open'> & ModalProps

const Modal = ({
  children,
  title,
  description,
  rootProps,
  overlayProps,
  closeProps,
  descriptionProps,
  id,
  length,
  depth,
  depthOfType,
  index,
  lengthOfType,
  ...rest
}: ExtendedModalProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <DialogPrimitive.Root {...rootProps} open={open}>
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
              animate={{ opacity: depth === 0 ? 1 : 0 }}
              exit={{ opacity: 0 }}
              {...overlayProps}
            />
            <StyledContent asChild>
              {/* @ts-ignore */}
              <motion.div
                style={{
                  transformOrigin: depth > 0 ? 'top' : 'center',
                  willChange: 'transform',
                }}
                initial={{
                  opacity: 0,
                  transform: `translate(-50%, -50%) scale(0.9) translateY(0) translateZ(0.0001px)`,
                }}
                animate={{
                  opacity: 1,
                  transform: `translate(-50%, -50%) scale(${
                    1 - depthOfType * (0.2 / lengthOfType)
                  }) translateY(-${
                    depthOfType * (50 / lengthOfType)
                  }px) translateZ(0.0000px)`,
                  filter: depth > 0 ? 'blur(2px)' : 'blur(0px)',
                }}
                exit={{
                  opacity: 0,
                  transform: `translate(-50%, -50%) scale(0.9) translateY(0) translateY(0) translateZ(0.0001px)`,
                }}
                {...rest}
              >
                {title !== undefined && <StyledTitle>{title}</StyledTitle>}
                <StyledDescription {...descriptionProps} asChild>
                  <div>{description}</div>
                </StyledDescription>
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
              </motion.div>
            </StyledContent>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

export default Modal
