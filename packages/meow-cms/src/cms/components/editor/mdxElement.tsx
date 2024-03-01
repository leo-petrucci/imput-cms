import { Descendant } from 'slate'
import { useSelected } from 'slate-react'
import { CustomRenderElementProps } from '../../../cms/components/editor/element'
import ComponentEditor from '../../../cms/components/editor/componentEditor'
import { useEditorDepth } from '../../../cms/components/editor/depthContext'
import { Panel, ErrorBoundary } from '@meow/components'
import { BracketsSquare } from 'phosphor-react'
import { MDXNode } from '../../../cms/types/mdxNode'
import React from 'react'
import { cva } from 'class-variance-authority'
import { CustomElement } from '../../types/slate'
import { FakeP } from '@meow/components/Typography'

const StyledMdxButton = cva(
  'w-full rounded-md border border-input transition-colors bg-background shadow-sm hover:bg-accent hover:text-accent-foreground my-1 cursor-pointer p-0 overflow-hidden relative',
  {
    variants: {
      selected: {
        true: 'outline outline-2 outline-offset-4 outline-primary/80',
      },
    },
  }
)

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
   * The component's name
   */
  name: string
  /**
   * An array of slate elements
   */
  reactChildren: Descendant[]
  /**
   * Component props
   */
  attributes: MDXNode[]
  /**
   * Component children
   */
  text: string
}

const MdxElement = (props: CustomRenderElementProps) => {
  const { attributes, children, element } = props
  const mdxElement = element as MdxElementShape
  const { addElement, removeElement, getDepth, depthArray } = useEditorDepth()

  const thisDepth = getDepth(mdxElement.id)

  const selected = useSelected()

  return (
    <div {...attributes}>
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
            <div className="p-4">
              <ComponentEditor {...props} />
            </div>
          </ErrorBoundary>
        )}
      >
        <button
          className={StyledMdxButton({ selected })}
          contentEditable={false}
        >
          <div className="p-4">
            <div className="flex flex-row gap-2 items-center">
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
