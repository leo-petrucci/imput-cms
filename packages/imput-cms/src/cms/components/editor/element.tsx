import React from 'react'
import { RenderElementProps } from 'slate-react'
import CodeblockElement from '../../../cms/components/editor/codeblockElement/codeblockElement'
import Image from '../../../cms/components/editor/images/imageElement'
import MdxElement from '../../../cms/components/editor/mdxElement'
import { CustomElement } from '../../types/slate'
import LinkElement, { InlineChromiumBugfix } from './linkElement/linkElement'
import { defaultNodeTypes } from './remark-slate'

export interface CustomRenderElementProps
  extends Omit<RenderElementProps, 'element'> {
  element: CustomElement
}

export const Element = (props: CustomRenderElementProps) => {
  const { attributes, children, element } = props
  const style = {} as React.CSSProperties

  switch (element.type) {
    case defaultNodeTypes.link:
      return <LinkElement {...props} />
    case defaultNodeTypes.code_snippet:
      return (
        <code
          className="imp-px-[0.2em] imp-py-[0.4em] imp-m-0 imp-text-[85%] imp-whitespace-break-spaces imp-bg-secondary imp-rounded imp-text-red-500"
          {...props.attributes}
        >
          <InlineChromiumBugfix />
          {props.children}
          <InlineChromiumBugfix />
        </code>
      )
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
        <blockquote
          className="imp-border-l-4 imp-pl-4 imp-border-primary"
          style={style}
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case defaultNodeTypes.ul_list:
      return (
        <ul className="imp-ml-4 imp-flex-1" style={style} {...attributes}>
          {children}
        </ul>
      )
    case defaultNodeTypes.heading[1]:
      return (
        <h1 className="imp-text-4xl" {...attributes}>
          {children}
        </h1>
      )
    case defaultNodeTypes.heading[2]:
      return (
        <h2 className="imp-text-3xl" {...attributes}>
          {children}
        </h2>
      )
    case defaultNodeTypes.heading[3]:
      return (
        <h3 className="imp-text-2xl" {...attributes}>
          {children}
        </h3>
      )
    case defaultNodeTypes.heading[4]:
      return (
        <h4 className="imp-text-xl" {...attributes}>
          {children}
        </h4>
      )
    case defaultNodeTypes.heading[5]:
      return (
        <h5 className="imp-text-lg" {...attributes}>
          {children}
        </h5>
      )
    case defaultNodeTypes.heading[6]:
      return (
        <h6 className="imp-text-base" {...attributes}>
          {children}
        </h6>
      )

    case defaultNodeTypes.listItem:
      return (
        <li className="imp-flex-1" style={style} {...attributes}>
          {children}
        </li>
      )
    case defaultNodeTypes.ol_list:
      return (
        <ol
          className="imp-ml-4 imp-flex-1"
          style={{ ...style }}
          {...attributes}
        >
          {children}
        </ol>
      )
    default:
      if (element.type === 'link') {
        return children
      }
      return (
        <p style={{ ...style, width: '100%' }} {...attributes}>
          {children}
        </p>
      )
  }
}
