import { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * This will check if a paragraph ends with `<` and escape it as a component with `</>`
 * It sucks, but it's the best solution I could find
 * https://github.com/creativiii/meow-cms/issues/56
 */
export const escapeSmallerThan: Plugin = (options) => {
  return transformer
  function transformer(tree: any) {
    visit(tree, 'paragraph', (node) => {
      // Don't bother unless paragraph has children
      if (node.children.length === 0) {
        return
      }

      visit(node, 'text', (textNode) => {
        if (textNode.value.endsWith('<')) {
          let str = textNode.value.split('')
          str[textNode.value.length - 1] = '</>'
          textNode.value = str.join('')
        }
      })
    })
  }
}
