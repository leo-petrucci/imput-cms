import { BaseElement } from 'slate'
import { RenderElementProps } from 'slate-react'

/**
 * Interface with custom element values
 */
export interface CustomElement extends BaseElement {
  type: string
  url?: string
}
