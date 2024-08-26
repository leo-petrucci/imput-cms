import {
  BaseEditor,
  Editor,
  Element,
  Location,
  Path,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { ReactEditor } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import { defaultNodeTypes } from '../remark-slate'
import codeblock from '@imput/components/codeblock'

/**
 * Used to wrap a specific selection in a style, for example bold or italics
 * @param format the type of formatting to apply (e.g. bold)
 */
export const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

export const isMarkActive = (editor: BaseEditor, format: string) => {
  const marks = Editor.marks(editor)
  // @ts-ignore
  return marks ? marks[format] === true : false
}

const LIST_TYPES = ['ul_list', 'ol_list']

/**
 * Used to wrap an entire paragraph in a new block, like a code block or a list
 * @param format the type of block it'll be wrapped in (e.g. `code_block`)
 */
export const toggleBlock = (editor: BaseEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n: any) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      // @ts-ignore
      LIST_TYPES.includes(n.type),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  newProperties = {
    // @ts-ignore
    type: isActive ? 'paragraph' : isList ? 'list_item' : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const isBlockActive = (
  editor: BaseEditor,
  format: string,
  blockType = 'type'
) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        // @ts-ignore
        n[blockType] === format,
    })
  )

  return !!match
}

/**
 * Add an empty paragraph at specified location
 */
export const addEmptySpace = (
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * Where the new paragraph should be added
   */
  where: Path
) => {
  Transforms.insertNodes(
    editor,
    // @ts-ignore
    { id: uuidv4(), children: [{ text: '' }], type: 'paragraph' },
    { at: where, select: true }
  )
}

/**
 * Remove an element at specified location
 * @param editor the slate editor instance
 * @param where where the element should be removed
 */
export const removeElement = (
  /**
   * The slate editor instance
   */
  editor: BaseEditor,
  /**
   * Where the element should be removed
   */
  where: Location
) => {
  Transforms.removeNodes(editor, { at: where })
}

/**
 * Wraps the current node into a code block
 */
export const addCodeBlockNode = (
  editor: ReactEditor,
  editorRef: HTMLElement
) => {
  Transforms.wrapNodes(
    editor,
    // @ts-expect-error
    { type: defaultNodeTypes.code_block, language: 'plain', children: [] },
    {
      match: (n) =>
        // @ts-expect-error
        Element.isElement(n) && n.type === defaultNodeTypes.paragraph,
      split: true,
    }
  )
  Transforms.setNodes(
    editor,
    // @ts-expect-error
    { type: defaultNodeTypes.code_line },
    {
      match: (n) =>
        // @ts-expect-error
        Element.isElement(n) && n.type === defaultNodeTypes.paragraph,
    }
  )
  // Now, move the cursor to the start of the newly created code_block
  const [codeBlock] = Editor.nodes(editor, {
    match: (n) =>
      // @ts-ignore
      Element.isElement(n) && n.type === defaultNodeTypes.code_line,
    mode: 'lowest',
  })

  if (codeBlock) {
    const [node, path] = codeBlock
    setTimeout(() => {
      editorRef.focus()
      setTimeout(() => {
        Transforms.select(editor, Editor.end(editor, path))
      }, 10)
    }, 0)
  }
}

/**
 * Wraps the current node into a code block
 */
export const addHeadingNode = (
  editor: ReactEditor,
  editorRef: HTMLElement,
  level: 1 | 2 | 3 | 4 | 5 | 6
) => {
  Transforms.setNodes<SlateElement>(editor, {
    // @ts-expect-error
    type: defaultNodeTypes.heading[level],
  })

  // Now, move the cursor to the start of the newly created code_block
  const [heading] = Editor.nodes(editor, {
    match: (n) =>
      // @ts-ignore
      Element.isElement(n) && n.type === defaultNodeTypes.heading[level],
    mode: 'lowest',
  })

  if (heading) {
    const [node, path] = heading
    setTimeout(() => {
      editorRef.focus()
      setTimeout(() => {
        Transforms.select(editor, Editor.end(editor, path))
      }, 10)
    }, 0)
  }
}

export const selectCreatedNode = (
  editor: ReactEditor,
  editorRef: HTMLElement,
  nodeType: string,
  mode: 'highest' | 'lowest' = 'lowest'
) => {
  const [foundNode] = Editor.nodes(editor, {
    match: (n) =>
      // @ts-ignore
      Element.isElement(n) && !Editor.isEditor(n) && n.type === nodeType,
    mode,
  })

  if (foundNode) {
    const [_node, path] = foundNode
    setTimeout(() => {
      editorRef.focus()
      setTimeout(() => {
        Transforms.select(editor, Editor.end(editor, path))
      }, 10)
    }, 0)
  }
}
