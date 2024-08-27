import { BaseElement, Descendant } from 'slate'
import { useSelected } from 'slate-react'
import { CustomRenderElementProps } from '../../element'
import ComponentEditor from '../../componentEditor'
import { useEditorDepth } from '../../depthContext'
import { Panel, ErrorBoundary } from '@imput/components'
import { BracketsSquare } from 'phosphor-react'
import { MDXNode } from '../../../../types/mdxNode'
import React, { useEffect, useRef } from 'react'
import { cva } from 'class-variance-authority'
import { CustomElement } from '../../../../types/slate'
import { FakeP } from '@imput/components/Typography'
import { AttributeType } from '../../lib/mdx'
import isHotkey from 'is-hotkey'

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

  /**
   * Hack for keyboard only editing, allows opening the mdx overlay
   * by pressing enter on the selected element
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(mdxElement.name, 'onkeydown')
      if (isHotkey('enter', event)) {
        buttonRef.current?.click()
      }
    }
    if (selected) document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selected])

  return (
    <>
      <Panel
        id="component"
        index={thisDepth}
        depth={thisDepth}
        depthOfType={thisDepth}
        length={depthArray.length}
        lengthOfType={depthArray.length}
        rootProps={{
          onOpenChange: (open) => {
            if (open) {
              addElement(mdxElement.id)
            } else {
              removeElement(mdxElement.id)
            }
          },
        }}
        title={'Edit component'}
        description={() => (
          <ErrorBoundary>
            <div className="imp-p-4">
              <ComponentEditor {...props} />
            </div>
          </ErrorBoundary>
        )}
      >
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
      </Panel>
    </>
  )
}