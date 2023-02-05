import * as React from 'react'
import { SpuntareProps } from '@ironeko/spuntare'
import Modal, { ModalProps } from 'cms/components/designSystem/modal'

type ExtendedOverlayProps = Omit<SpuntareProps, 'open'> & ModalProps

export interface PanelProps extends ExtendedOverlayProps {}

const Panel = (props: PanelProps) => {
  return (
    <Modal
      {...props}
      initial={{
        opacity: 0,
        transform: `scale(1) translateX(-25%) translateX(0px)`,
      }}
      animate={{
        opacity: 1,
        transform: `scale(${
          1 - props.depthOfType * (0.2 / props.lengthOfType)
        }) translateX(0%) translateX(${
          props.depthOfType * (100 / props.lengthOfType)
        }px)`,
        filter: props.depth > 0 ? 'blur(2px)' : 'blur(0px)',
      }}
      exit={{
        opacity: 0,
        transform: `scale(1)  translateX(-25%) translateX(0)`,
      }}
      style={{
        boxSizing: 'border-box',
        // height: '100vh',
        maxHeight: '100vh',
        left: '1em',
        top: '1em',
        bottom: '1em',
        right: 'auto',
        minWidth: '500px',
        borderRadius: '.5em',
        transformOrigin: props.depth > 0 ? 'center right' : 'center center',
      }}
    />
  )
}

export default Panel
