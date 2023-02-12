import React from 'react'
import { RenderElementProps } from 'slate-react'
import { styled } from '../../../../stitches.config'
import CodeblockElement from '../../../cms/components/editor/codeblockElement/codeblockElement'
import Image from '../../../cms/components/editor/images/imageElement'
import MdxElement from '../../../cms/components/editor/mdxElement'
import { defaultNodeTypes } from './remark-slate'

export interface CustomRenderElementProps
  extends Omit<RenderElementProps, 'element'> {
  element: CustomElement
}

/**
 * Interface with custom element values
 */
interface CustomElement extends Pick<RenderElementProps, 'element'> {
  align: string
  type: string
}

export const Element = (props: CustomRenderElementProps) => {
  const { attributes, children, element } = props
  const style = {
    textAlign: element.align,
  } as React.CSSProperties

  switch (element.type) {
    case defaultNodeTypes.image:
      // @ts-ignore
      // eslint-disable-next-line jsx-a11y/alt-text
      return <Image {...props} />
    case defaultNodeTypes.mdxJsxFlowElement:
      return <MdxElement {...props} />
    case defaultNodeTypes.code_block:
      return <CodeblockElement {...props} />
    case defaultNodeTypes.block_quote:
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case defaultNodeTypes.ul_list:
      return (
        <StyledUnorderedList style={style} {...attributes}>
          {children}
        </StyledUnorderedList>
      )
    case defaultNodeTypes.heading[1]:
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case defaultNodeTypes.heading[2]:
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case defaultNodeTypes.heading[3]:
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      )
    case defaultNodeTypes.heading[4]:
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      )
    case defaultNodeTypes.heading[5]:
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      )
    case defaultNodeTypes.heading[6]:
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      )

    case defaultNodeTypes.listItem:
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case defaultNodeTypes.ol_list:
      return (
        <StyledOrderedList style={{ ...style }} {...attributes}>
          {children}
        </StyledOrderedList>
      )
    default:
      return (
        <p style={{ ...style, width: '100%' }} {...attributes}>
          {children}
        </p>
      )
  }
}

const StyledOrderedList = styled('ol', {
  marginLeft: '$4',
  flex: '1 1 0%',
})

const StyledUnorderedList = styled('ul', {
  marginLeft: '$4',
  flex: '1 1 0%',
})
