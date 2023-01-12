import Prism from 'prismjs'
import React, { useCallback, useMemo } from 'react'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { Text, createEditor, Descendant, Node, BaseEditor } from 'slate'
import { withHistory } from 'slate-history'
import { CustomRenderElementProps } from './element'
import { MdxElementShape } from './mdxElement'
import { editAttributes } from './lib/editAttributes'
import { styled } from '@stitches/react'
import { MDXNode } from 'cms/types/mdxNode'

const CodeBlockEditor = ({
  value,
  editor,
  ...props
}: {
  value: MDXNode
  editor: ReactEditor
  name: string
  json: string | undefined
} & CustomRenderElementProps) => {
  const { element } = props
  const mdxElement = element as MdxElementShape
  const { id } = mdxElement

  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const codeEditor = useMemo(() => withHistory(withReact(createEditor())), [])

  const path = ReactEditor.findPath(editor, element as unknown as Node)

  // decorate function depends on the language selected
  const decorate = useCallback(([node, path]) => {
    const ranges: {
      type: LeafNode['type']
      anchor: {
        path: any
        offset: number
      }
      focus: {
        path: any
        offset: any
      }
    }[] = []
    // nodes can be objects, we want the smallest part
    if (!Text.isText(node)) {
      return ranges
    }

    const tokens = Prism.tokenize(node.text, Prism.languages['javascript'])
    let start = 0

    for (const token of tokens) {
      const length = getLength(token)
      const end = start + length

      if (typeof token !== 'string') {
        ranges.push({
          type: token.type as LeafNode['type'],
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })
      }

      start = end
    }

    return ranges
  }, [])

  return (
    <Slate
      editor={codeEditor}
      value={
        [
          {
            // @ts-ignore
            type: 'paragraph',
            children: [
              {
                // @ts-ignore
                text: value.value.value || '',
              },
            ],
          },
        ] as Descendant[]
      }
      onChange={(nodes) => {
        const code = nodes.map((n) => Node.string(n)).join('\n')
        try {
          // reformat our text into JSON
          // const json = JSON.stringify(JSON.parse(code))

          // set the value to the editor
          editAttributes(path, mdxElement, value, editor, code)
        } catch (e) {}
      }}
    >
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some code..."
      />
    </Slate>
  )
}

const getLength = (token: any) => {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else {
    return token.content.reduce((l: any, t: any) => l + getLength(t), 0)
  }
}

const StyledLeaf = styled('span', {
  fontFamily: 'monospace',
  background: 'hsla(0, 0%, 100%, .5)',
  variants: {
    type: {
      comment: {
        color: 'slategray',
      },
      operator: {
        color: '#9a6e3a',
      },
      url: {
        color: '#9a6e3a',
      },
      keyword: {
        color: '#07a',
      },
      variable: {
        color: '#e90',
      },
      regex: {
        color: '#e90',
      },
      number: {
        color: '#905',
      },
      boolean: {
        color: '#905',
      },
      tag: {
        color: '#905',
      },
      constant: {
        color: '#905',
      },
      symbol: {
        color: '#905',
      },
      'attr-name': {
        color: '#905',
      },
      selector: {
        color: '#905',
      },
      punctuation: {
        color: '#999',
      },
      string: {
        color: '#999',
      },
    },
  },
})

type LeafNode = {
  type:
    | 'comment'
    | 'operator'
    | 'url'
    | 'keyword'
    | 'variable'
    | 'regex'
    | 'number'
    | 'boolean'
    | 'tag'
    | 'constant'
    | 'symbol'
    | 'attr-name'
    | 'selector'
    | 'punctuation'
    | 'string'
    | 'char'
    | 'function'
    | 'class-name'
  text: string
}

// different token types, styles found on Prismjs website
const Leaf = ({
  attributes,
  children,
  leaf,
}: {
  attributes: any
  children: React.ReactNode
  leaf: LeafNode
}) => {
  return (
    <StyledLeaf {...attributes} type={leaf.type}>
      {children}
    </StyledLeaf>
  )
}

export default CodeBlockEditor
