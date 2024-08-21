import { Descendant } from 'slate'
import { useSelected } from 'slate-react'
import { CustomRenderElementProps } from '../../../cms/components/editor/element'
import ComponentEditor from '../../../cms/components/editor/componentEditor'
import { useEditorDepth } from '../../../cms/components/editor/depthContext'
import { Panel, ErrorBoundary } from '@imput/components'
import { BracketsSquare } from 'phosphor-react'
import { MDXNode } from '../../../cms/types/mdxNode'
import React from 'react'
import { cva } from 'class-variance-authority'
import { CustomElement } from '../../types/slate'
import { FakeP } from '@imput/components/Typography'
import { AttributeType } from './lib/mdx'

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
export interface MdxElementShape extends CustomElement {
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
const MdxElement = (props: CustomRenderElementProps) => {
  const { attributes, children, element } = props
  const mdxElement = element as MdxElementShape
  const { addElement, removeElement, getDepth, depthArray } = useEditorDepth()

  const thisDepth = getDepth(mdxElement.id)

  const selected = useSelected()

  return (
    <div>
      {children}
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
          contentEditable={false}
        >
          <div className="imp-p-4">
            <div className="imp-flex imp-flex-row imp-gap-2 imp-items-center">
              <BracketsSquare size={16} weight="bold" />
              <FakeP>{mdxElement.name} Block</FakeP>
            </div>
          </div>
        </button>
      </Panel>
    </div>
  )
}

export default MdxElement
