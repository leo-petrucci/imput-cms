import { MdxElementShape } from '../Elements/MdxElement'
import { BlockType, LeafType, NodeTypes, defaultNodeTypes } from './ast-types'
import serialize, { Options } from './serialize'

/**
 * Recursively stringifies an array for serialization
 */
export const recursivelyStringifyArray = (arr: any[]): string => {
  return (
    '[' +
    arr
      .map((item) => {
        if (Array.isArray(item)) {
          return recursivelyStringifyArray(item)
        } else if (typeof item === 'object' && item !== null) {
          // replace this with a function
          return recursivelyStringifyObject(item)
        } else if (typeof item === 'string') {
          return `"${item}"`
        } else {
          return String(item)
        }
      })
      .join(', ') +
    ']'
  )
}

/**
 * Recursively stringifies an object for serialization
 */
export const recursivelyStringifyObject = (obj: any): string => {
  if (obj === null) return 'null'
  if (typeof obj !== 'object') return stringifyValue(obj)

  if (Array.isArray(obj)) {
    return '[' + obj.map(recursivelyStringifyArray).join(', ') + ']'
  }

  const entries = Object.entries(obj).map(([key, value]) => {
    return `${key}: ${recursivelyStringifyObject(value)}`
  })

  return '{' + entries.join(', ') + '}'
}

function stringifyValue(value: any): string {
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value)
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'function') return value.toString()
  if (typeof value === 'object') return recursivelyStringifyObject(value)
  return String(value)
}

/**
 * Quickly check if type is `mdxJsxFlowElement`
 */
export const isMdxElement = (type: BlockType['type']) => {
  return type === 'mdxJsxFlowElement'
}

export const isLeafNode = (node: BlockType | LeafType): node is LeafType => {
  return typeof (node as LeafType).text === 'string'
}

/**
 * Recursively serializes a component's children.
 */
export const serializeMdxChildren = (
  chunk: MdxElementShape,
  opts: Options = { nodeTypes: defaultNodeTypes }
) => {
  const {
    nodeTypes: userNodeTypes = defaultNodeTypes,
    ignoreParagraphNewline = false,
  } = opts

  let type = (chunk as BlockType).type || ''

  const nodeTypes: NodeTypes = {
    ...defaultNodeTypes,
    ...userNodeTypes,
    heading: {
      ...defaultNodeTypes.heading,
      ...userNodeTypes.heading,
    },
  }

  return chunk.reactChildren
    .map((c: any) => {
      return serialize(
        { ...c, parentType: type },
        {
          nodeTypes,
          // WOAH.
          // what we're doing here is pretty tricky, it relates to the block below where
          // we check for ignoreParagraphNewline and set type to paragraph.
          // We want to strip out empty paragraphs sometimes, but other times we don't.
          // If we're the descendant of a list, we know we don't want a bunch
          // of whitespace. If we're parallel to a link we also don't want
          // to respect neighboring paragraphs
          ignoreParagraphNewline:
            ignoreParagraphNewline &&
            // if we have c.break, never ignore empty paragraph new line
            !(c as BlockType).break,
        }
      )
    })
    .join('')
}
