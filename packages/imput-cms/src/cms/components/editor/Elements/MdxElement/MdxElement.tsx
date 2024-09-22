import { BaseElement, Descendant } from 'slate'
import { useSelected } from 'slate-react'
import { CustomRenderElementProps } from '../../element'
import ComponentEditor from '../../componentEditor'
import { useEditorDepth } from '../../depthContext'
import ErrorBoundary from '@imput/components/errorBoundary'
import { BracketsSquare } from 'phosphor-react'
import { MDXNode } from '../../../../types/mdxNode'
import { useEffect, useMemo, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { FakeP } from '@imput/components/Typography'
import { AttributeType } from '../../lib/mdx'
import isHotkey from 'is-hotkey'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@imput/components/Dialog'

const StyledMdxButton = cva(
  'imp-w-full imp-rounded-md imp-border imp-border-input imp-transition-colors imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground imp-my-1 imp-cursor-pointer imp-p-0 imp-overflow-hidden imp-relative',
  {
    variants: {
      selected: {
        true: 'imp-outline imp-outline-2 imp-outline-offset-4 imp-outline-primary/80',
      },
    },
  }
)

/**
 * The shape of an attribute after having been parsed
 */
export type ReactAttribute = {
  type: AttributeType
  value: any
  attributeName: string
}

/**
 * Interface for custom MDX element
 */
export interface MdxElementShape extends BaseElement {
  type: string
  align: string
  /**
   * Unique element Id, exists only on some elements
   */
  id: string
  /**
   * The component's name, null if a fragment
   */
  name: string | null
  /**
   * An array of slate elements
   */
  reactChildren: Descendant[]
  /**
   * Component props
   */
  attributes: MDXNode[]
  reactAttributes: ReactAttribute[]
  /**
   * Component children
   */
  text: string
}

/**
 * A slate element that represents a React object. Can be clicked.
 */
export const MdxElement = (props: CustomRenderElementProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const { attributes, children, element } = props
  // TODO: Fix this type
  const mdxElement = element as MdxElementShape
  const { addElement, removeElement, getDepth, depthArray } = useEditorDepth()

  const thisDepth = getDepth(mdxElement.id)

  const selected = useSelected()

  const isOpen = useMemo(() => {
    return Boolean(depthArray.find((a) => a.id === mdxElement.id))
  }, [depthArray])

  /**
   * Hack for keyboard only editing, allows opening the mdx overlay
   * by pressing enter on the selected element
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHotkey('enter', event)) {
        buttonRef.current?.click()
      }
    }
    if (selected && !isOpen) document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selected, isOpen])

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (open) {
            addElement(mdxElement.id)
          } else {
            removeElement(mdxElement.id)
          }
        }}
      >
        <DialogTrigger asChild>
          <button
            data-testid={`${mdxElement.name}-block`}
            className={StyledMdxButton({ selected })}
            {...attributes}
            ref={(ref) => {
              buttonRef.current = ref
              attributes.ref(ref)
            }}
          >
            <div className="imp-p-4" contentEditable={false}>
              <div className="imp-flex imp-flex-row imp-gap-2 imp-items-center">
                <BracketsSquare size={16} weight="bold" />
                <FakeP>{mdxElement.name} Block</FakeP>
              </div>
            </div>
            {children}
          </button>
        </DialogTrigger>
        <DialogContent
          showOverlay={false}
          className="imp-translate-x-0 imp-translate-y-0 data-[state=closed]:!imp-slide-out-to-left-1/2 data-[state=closed]:!imp-slide-out-to-top-0 data-[state=open]:!imp-slide-in-from-left-1/2 data-[state=open]:!imp-slide-in-from-top-0"
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
            transformOrigin: thisDepth > 0 ? 'center right' : 'center center',
            transform: `scale(${
              1 - thisDepth * (0.2 / depthArray.length)
            }) translateX(0%) translateX(${thisDepth * (100 / depthArray.length)}px)`,
            filter: thisDepth > 0 ? 'blur(2px)' : 'blur(0px)',
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit component</DialogTitle>
          </DialogHeader>

          <ErrorBoundary>
            <div className="imp-py-4">
              <ComponentEditor {...props} />
            </div>
          </ErrorBoundary>
        </DialogContent>
      </Dialog>
    </>
  )
}
