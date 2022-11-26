import { Descendant } from 'slate'
import { RenderElementProps, useSlate } from 'slate-react'
import { CustomRenderElementProps } from './element'
import ComponentEditor from './componentEditor'
import Panel from '../designSystem/panel'
import Box from '../designSystem/box'
import { useEditorDepth } from './depthContext'

/**
 * Interface for custom MDX element
 */
export interface MdxElementShape extends Pick<RenderElementProps, 'element'> {
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
  attributes: {
    type: 'mdxJsxAttribute'
    name: string
    value: // strings are easy
    | string
      // numbers are a bit more complicated
      | {
          type: string
          value: string
        }
  }[]
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

  return (
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
      description={<ComponentEditor {...props} />}
    >
      <div contentEditable={false} {...attributes}>
        <Box
          css={{
            cursor: 'pointer',
            border: '1px solid $gray-400',
            borderRadius: '$md',
            padding: '$4',
            position: 'relative',
            marginBottom: '$2',
          }}
        >
          <Box
            css={{
              position: 'absolute',
              fontSize: '$xs',
              right: 0,
              top: 0,
              color: '$gray-500',
              textTransform: 'uppercase',
              fontWeight: '$medium',
              letterSpacing: '$tracking-wider',
              padding: '$1',
            }}
          >
            MDX Component
          </Box>
          <Box
            css={{
              color: '$gray-800',
            }}
          >
            {mdxElement.name}
          </Box>
          <div>{children}</div>
        </Box>
      </div>
    </Panel>
  )
}

export default MdxElement
