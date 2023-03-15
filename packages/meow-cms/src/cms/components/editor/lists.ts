import { createEditor, BaseElement, Descendant, Element, Node } from 'slate'
import { ListType, withLists } from '../../../cms/components/editor/slate-lists'
import { defaultNodeTypes } from './remark-slate'

export const withListsPlugin = withLists({
  isConvertibleToListTextNode(node: Node) {
    return Element.isElementType(node, defaultNodeTypes.paragraph)
  },
  isDefaultTextNode(node: Node) {
    return Element.isElementType(node, defaultNodeTypes.paragraph)
  },
  isListNode(node: Node, type?: ListType) {
    if (type) {
      return Element.isElementType(node, type)
    }
    return (
      Element.isElementType(node, defaultNodeTypes.ol_list) ||
      Element.isElementType(node, defaultNodeTypes.ul_list)
    )
  },
  isListItemNode(node: Node) {
    return Element.isElementType(node, defaultNodeTypes.listItem)
  },
  isListItemTextNode(node: Node) {
    return Element.isElementType(node, defaultNodeTypes.listItemText)
  },
  createDefaultTextNode(props = {}) {
    return {
      children: [{ text: '' }],
      ...props,
      type: defaultNodeTypes.paragraph,
    }
  },
  createListNode(type: ListType = ListType.UNORDERED, props = {}) {
    const nodeType =
      type === ListType.ORDERED
        ? defaultNodeTypes.ol_list
        : defaultNodeTypes.ul_list
    return { children: [{ text: '' }], ...props, type: nodeType }
  },
  createListItemNode(props = {}) {
    return {
      children: [{ text: '' }],
      ...props,
      type: defaultNodeTypes.listItem,
    }
  },
  createListItemTextNode(props = {}) {
    return {
      children: [{ text: '' }],
      ...props,
      type: defaultNodeTypes.listItemText,
    }
  },
})
