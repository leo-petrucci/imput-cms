import Prism from 'prismjs'
import { Descendant, Editor, Element, Node, NodeEntry, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { defaultNodeTypes } from '../../remark-slate'
import { KeyboardEvent, useCallback } from 'react'
import isHotkey from 'is-hotkey'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'

/**
 * TODO: Splitting code to tokens broke at some point, not entirely sure why.
 */

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const SetNodeToDecorations = () => {
  const editor = useSlate() as any

  const blockEntries = Array.from(
    Editor.nodes(editor, {
      at: [],
      mode: 'highest',
      match: (n) =>
        // @ts-expect-error
        Element.isElement(n) && n.type === defaultNodeTypes.code_block,
    })
  )

  const nodeToDecorations = mergeMaps(
    // @ts-expect-error
    ...blockEntries.map(getChildNodeToDecorations)
  )

  editor.nodeToDecorations = nodeToDecorations

  return null
}

const getChildNodeToDecorations = ([block, blockPath]: NodeEntry<{
  type: 'code_block'
  language: string
  children: Descendant[]
}>) => {
  const nodeToDecorations = new Map<Element, Range[]>()

  const text = block.children.map((line) => Node.string(line)).join('\n')
  const language = block.language
  const prismLanguage =
    Prism.languages[language] || Prism.languages['plaintext']
  const tokens = Prism.tokenize(text, prismLanguage)
  const normalizedTokens = normalizeTokens(tokens) // make tokens flat and grouped by line
  const blockChildren = block.children as Element[]

  for (let index = 0; index < normalizedTokens.length; index++) {
    const tokens = normalizedTokens[index]
    const element = blockChildren[index]

    if (!nodeToDecorations.has(element)) {
      nodeToDecorations.set(element, [])
    }

    let start = 0
    for (const token of tokens) {
      const length = token.content.length
      if (!length) {
        continue
      }

      const end = start + length

      const path = [...blockPath, index, 0]
      const range = {
        anchor: { path, offset: start },
        focus: { path, offset: end },
        token: true,
        ...Object.fromEntries(token.types.map((type) => [type, true])),
      }

      nodeToDecorations.get(element)!.push(range)

      start = end
    }
  }

  return nodeToDecorations
}

const mergeMaps = <K, V>(...maps: Map<K, V>[]) => {
  const map = new Map<K, V>()

  for (const m of maps) {
    for (const item of m) {
      map.set(...item)
    }
  }

  return map
}

type PrismToken = Prism.Token
type Token = {
  types: string[]
  content: string
  empty?: boolean
}

const newlineRe = /\r\n|\r|\n/

// Takes an array of Prism's tokens and groups them by line, turning plain
// strings into tokens as well. Tokens can become recursive in some cases,
// which means that their types are concatenated. Plain-string tokens however
// are always of type "plain".
// This is not recursive to avoid exceeding the call-stack limit, since it's unclear
// how nested Prism's tokens can become
export const normalizeTokens = (
  tokens: Array<PrismToken | string>
): Token[][] => {
  const typeArrStack: string[][] = [[]]
  const tokenArrStack = [tokens]
  const tokenArrIndexStack = [0]
  const tokenArrSizeStack = [tokens.length]

  let i = 0
  let stackIndex = 0
  let currentLine: any = []

  const acc = [currentLine]

  while (stackIndex > -1) {
    while (
      (i = tokenArrIndexStack[stackIndex]++) < tokenArrSizeStack[stackIndex]
    ) {
      let content: any
      let types = typeArrStack[stackIndex]

      const tokenArr = tokenArrStack[stackIndex]
      const token = tokenArr[i]

      // Determine content and append type to types if necessary
      if (typeof token === 'string') {
        types = stackIndex > 0 ? types : ['plain']
        content = token
      } else {
        types = appendTypes(types, token.type)
        if (token.alias) {
          types = appendTypes(types, token.alias)
        }

        content = token.content
      }

      // If token.content is an array, increase the stack depth and repeat this while-loop
      if (typeof content !== 'string') {
        stackIndex++
        typeArrStack.push(types)
        tokenArrStack.push(content)
        tokenArrIndexStack.push(0)
        tokenArrSizeStack.push(content.length)
        continue
      }

      // Split by newlines
      const splitByNewlines = content.split(newlineRe)
      const newlineCount = splitByNewlines.length

      currentLine.push({ types, content: splitByNewlines[0] })

      // Create a new line for each string on a new line
      for (let i = 1; i < newlineCount; i++) {
        normalizeEmptyLines(currentLine)
        acc.push((currentLine = []))
        currentLine.push({ types, content: splitByNewlines[i] })
      }
    }

    // Decreate the stack depth
    stackIndex--
    typeArrStack.pop()
    tokenArrStack.pop()
    tokenArrIndexStack.pop()
    tokenArrSizeStack.pop()
  }

  normalizeEmptyLines(currentLine)
  return acc
}

const appendTypes = (types: string[], add: string[] | string): string[] => {
  const typesSize = types.length
  if (typesSize > 0 && types[typesSize - 1] === add) {
    return types
  }

  return types.concat(add)
}

// Empty lines need to contain a single empty token, denoted with { empty: true }
const normalizeEmptyLines = (line: Token[]) => {
  if (line.length === 0) {
    line.push({
      types: ['plain'],
      content: '\n',
      empty: true,
    })
  } else if (line.length === 1 && line[0].content === '') {
    line[0].content = '\n'
    line[0].empty = true
  }
}

export const useDecorate = (editor: any) => {
  return useCallback(
    // @ts-expect-error
    ([node, path]) => {
      if (
        Element.isElement(node) &&
        // @ts-ignore
        node.type === defaultNodeTypes.code_line
      ) {
        const ranges = editor.nodeToDecorations.get(node) || []
        return ranges
      }

      return []
    },
    [editor.nodeToDecorations]
  )
}

/**
 * Returns whether cursor is within a code_block element
 */
export const isWithinCodeBlock = (editor: ReactEditor) => {
  const { selection } = editor

  if (selection && Range.isCollapsed(selection)) {
    const [block, blockPath] =
      Editor.above(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          // @ts-expect-error
          n.type === defaultNodeTypes.code_block,
      }) || []
    return Boolean(block)
  }
  return false
}

/**
 * Listens to onKeyDown events. If the cursor is within a codeblock, adds a tab space
 */
export const codeBlockOnKeyDown = (
  editor: ReactEditor,
  event: KeyboardEvent
) => {
  const { selection } = editor

  if (isHotkey('tab', event.nativeEvent) && isWithinCodeBlock(editor)) {
    const [block, blockPath] =
      Editor.above(editor, {
        match: (n) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          // @ts-expect-error
          n.type === defaultNodeTypes.code_block,
      }) || []

    if (block) {
      // handle tab key, insert spaces
      event.preventDefault()

      Editor.insertText(editor, '  ')
    }
  }
}
