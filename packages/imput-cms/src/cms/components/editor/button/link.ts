import {
  BaseEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
  Range,
} from 'slate'
import isUrl from 'is-url'
import { ReactEditor } from 'slate-react'
import { CustomElement } from '../../../types/slate'

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export const unwrapLink = (editor: BaseEditor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => {
      const customElement: CustomElement = n as any
      return (
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        customElement.type === 'link'
      )
    },
  })
}

export const wrapLink = (editor: BaseEditor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

export const insertLink = (editor: BaseEditor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

export const isLinkActive = (editor: BaseEditor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => {
      const customElement: CustomElement = n as any
      return (
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        customElement.type === 'link'
      )
    },
  })
  return !!link
}

export const withInlines = (editor: ReactEditor) => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = (element) => {
    const customElement: CustomElement = element as any
    return ['link'].includes(customElement.type) || isInline(element)
  }

  editor.insertText = (text) => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}
