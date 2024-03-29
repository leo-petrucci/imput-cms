import {
  BlockQuoteNode,
  CodeBlockNode,
  CodeSnippetNode,
  defaultNodeTypes,
  DeserializedNode,
  HeadingNode,
  ImageNode,
  InputNodeTypes,
  ItalicNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MdastNode,
  OptionType,
  ParagraphNode,
  TextNode,
  ThematicBreakNode,
} from '../../../../cms/components/editor/remark-slate/ast-types'
import { v4 as uuidv4 } from 'uuid'
import { MDXNode } from '../../../../cms/types/mdxNode'
import { cloneDeep } from 'lodash'

/**
 * Markdown to Slate deserialization.
 * From https://github.com/hanford/remark-slate
 */
export default function deserialize<T extends InputNodeTypes>(
  node: MdastNode,
  opts?: OptionType<T>
) {
  const types = {
    ...defaultNodeTypes,
    ...opts?.nodeTypes,
    heading: {
      ...defaultNodeTypes.heading,
      ...opts?.nodeTypes?.heading,
    },
  }

  const linkDestinationKey = opts?.linkDestinationKey ?? 'url'
  const imageSourceKey = opts?.imageSourceKey ?? 'link'
  const imageCaptionKey = opts?.imageCaptionKey ?? 'caption'

  let children: Array<DeserializedNode<T>> = [{ text: '' }]

  /**
   * Images are deserialised as children of paragraphs, so we want to make sure they're their own node rather than wrapped in a paragraph
   */
  if (
    node.type === 'paragraph' &&
    node.children?.length === 1 &&
    node.children[0].type === 'image'
  ) {
    node = node.children[0]
  }

  /**
   * This adds support for custom lists which are handled by @prezly/slate-lists
   */
  if (node.type === 'listItem') {
    node.children = node.children?.map((c) => {
      if (c.type === 'paragraph' && c.children && c.children?.length > 0) {
        const newChild = cloneDeep(c)
        newChild.type = 'list_item_text'
        return newChild
      }
      return c
    })
  }

  const nodeChildren = node.children

  if (nodeChildren && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
    // @ts-ignore
    children = nodeChildren.flatMap((c: MdastNode) =>
      deserialize(
        {
          ...c,
          ordered: node.ordered || false,
        },
        opts
      )
    )
  }

  const id = uuidv4()

  switch (node.type) {
    case 'heading':
      return {
        type: types.heading[node.depth || 1],
        children,
      } as HeadingNode<T>
    case 'list':
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children,
      } as ListNode<T>
    case 'listItem':
      return {
        type: types.listItem,
        children,
      } as ListItemNode<T>
    case 'paragraph':
      return { type: types.paragraph, children } as ParagraphNode<T>
    case 'mdxJsxFlowElement':
      const mdxNodes = node.attributes as unknown as MDXNode[]
      return {
        id,
        name: node.name,
        type: types.mdxJsxFlowElement,
        reactChildren: children,
        children: [{ text: '' }],
        attributes: mdxNodes,
      }
    case 'link':
      return {
        type: types.link,
        [linkDestinationKey]: node.url,
        children,
      } as LinkNode<T>
    case 'image':
      return {
        type: types.image,
        children: [{ text: '' }],
        [imageSourceKey]: node.url,
        [imageCaptionKey]: node.alt,
        // @ts-ignore
        title: node.title,
      } as ImageNode<T>
    case 'blockquote':
      return { type: types.block_quote, children } as BlockQuoteNode<T>
    case 'code':
      return {
        type: types.code_block,
        language: node.lang,
        children: [{ text: node.value }],
        code: [{ text: node.value }],
      } as CodeBlockNode<T>

    case 'html':
      if (node.value?.includes('<br>')) {
        return {
          break: true,
          type: types.paragraph,
          children: [{ text: node.value?.replace(/<br>/g, '') || '' }],
        } as ParagraphNode<T>
      }
      return { type: 'paragraph', children: [{ text: node.value || '' }] }

    case 'emphasis':
      return {
        [types.emphasis_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      } as unknown as ItalicNode<T>
    case 'strong':
      return {
        [types.strong_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      }
    case 'delete':
      return {
        [types.delete_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      }
    case 'inlineCode':
      return {
        type: types.code_snippet,
        children: [{ text: node.value }],
      } as CodeSnippetNode<T>
    case 'thematicBreak':
      return {
        type: types.thematic_break,
        children: [{ text: '' }],
      } as ThematicBreakNode<T>
    case 'list_item_text':
      return {
        type: 'list_item_text',
        children,
      }
    case 'text':
    default:
      return { text: node.value || '' }
  }
}

const forceLeafNode = (children: Array<TextNode>) => ({
  text: children.map((k) => k?.text).join(''),
})

// This function is will take any unknown keys, and bring them up a level
// allowing leaf nodes to have many different formats at once
// for example, bold and italic on the same node
function persistLeafFormats(
  children: Array<MdastNode>
): Omit<MdastNode, 'children' | 'type' | 'text'> {
  return children.reduce((acc, node) => {
    ;(Object.keys(node) as Array<keyof MdastNode>).forEach(function (key) {
      if (key === 'children' || key === 'type' || key === 'text') return

      acc[key] = node[key]
    })

    return acc
  }, {})
}
