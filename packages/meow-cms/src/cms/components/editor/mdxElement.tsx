import { Descendant } from 'slate'
import { useSelected } from 'slate-react'
import { CustomRenderElementProps } from '../../../cms/components/editor/element'
import ComponentEditor from '../../../cms/components/editor/componentEditor'
import { useEditorDepth } from '../../../cms/components/editor/depthContext'
import { styled } from '@meow/stitches'
import { Flex, Panel, ErrorBoundary, Box } from '@meow/components'
import { BracketsSquare } from 'phosphor-react'
import { MDXNode } from '../../../cms/types/mdxNode'
import React from 'react'
import { CustomElement } from '../../types/slate'

const StyledMdxButton = styled('button', {
  width: '100%',
  background: 'white',
  border: '1px solid var(--colors-gray-200)',
  borderRadius: '$md',
  marginTop: '$1',
  marginBottom: '$1',
  cursor: 'pointer',
  padding: 0,
  overflow: 'hidden',
  position: 'relative',

  variants: {
    selected: {
      true: {
        outline: '2px solid var(--colors-gray-600)',
        outlineOffset: '4px',
      },
    },
  },
})

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
            <ComponentEditor {...props} />
          </ErrorBoundary>
        )}
      >
        <StyledMdxButton selected={selected} contentEditable={false}>
          <Box
            css={{
              padding: '$4',
            }}
          >
            <Flex direction="row" gap="2" align="center">
              <BracketsSquare size={16} weight="bold" />
              <Box
                css={{
                  color: '$gray-800',
                  fontWeight: '500',
                  fontSize: '$sm',
                }}
              >
                {mdxElement.name} Block
              </Box>
            </Flex>
          </Box>
        </StyledMdxButton>
      </Panel>
    </div>
  )
}

export default MdxElement
