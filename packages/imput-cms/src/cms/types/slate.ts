import { BaseElement } from 'slate'
import { NodeTypes } from '../components/editor/remark-slate'
import { LinkElement } from '../components/editor/Elements/LinkElement'

/**
 * Interface with custom element values
 */
export type CustomElement = LinkElement | CodeSnippetElement | OtherElement

export interface LinkElement extends BaseElement {
  type: NodeTypes['link']
  url: string
}

export interface CodeSnippetElement extends BaseElement {
  type: NodeTypes['code_snippet']
}

/**
 * TODO: come back here and properly type the other elements we use
 */
interface OtherElement extends BaseElement {
  type: string
}
