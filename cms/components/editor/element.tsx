import React from 'react'
import { RenderElementProps } from 'slate-react'
import MdxElement from './mdxElement'

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
    case 'mdxJsxFlowElement':
      return <MdxElement {...props} />
    case 'block_quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'ul_list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading_one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading_two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'heading_three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      )
    case 'heading_four':
      return (
        <h4 style={style} {...attributes}>
          {children}
        </h4>
      )
    case 'heading_five':
      return (
        <h5 style={style} {...attributes}>
          {children}
        </h5>
      )
    case 'heading_six':
      return (
        <h6 style={style} {...attributes}>
          {children}
        </h6>
      )

    case 'list_item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'ol_list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}
