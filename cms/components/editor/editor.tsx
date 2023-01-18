import React from 'react'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkSlate, {
  serialize as remarkSerialize,
} from 'cms/components/editor/remark-slate'
import { createEditor, Descendant, Transforms } from 'slate'
import { Element } from 'cms/components/editor/element'
import MoveElement from 'cms/components/editor/moveElement'
import { Leaf } from 'cms/components/editor/leaf'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { unified } from 'unified'
import Toolbar from 'cms/components/editor/toolbar'
import {
  BlockButton,
  ComponentButton,
  MarkButton,
  StyledButton,
} from 'cms/components/editor/button/button'
import {
  CodeSimple,
  Image,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
} from 'phosphor-react'
import Box from 'cms/components/designSystem/box'
import { ImageElement } from 'cms/components/editor/images/imageElement'
import Controls from './controls'
import Flex from 'cms/components/designSystem/flex'

export const deserialize = (src: string): Descendant[] => {
  const { result } = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkSlate)
    .processSync(src)

  return result as Descendant[]
}

export const serialize = remarkSerialize

const withEditableVoids = (editor: ReactEditor) => {
  const { isVoid } = editor

  editor.isVoid = (element) => {
    // @ts-ignore
    return element.type === 'mdxJsxFlowElement' || element.type === 'image'
      ? true
      : isVoid(element)
  }

  return editor
}

const Editor = ({
  value,
  onChange,
}: {
  value: Descendant[]
  onChange?: (value: Descendant[]) => void
}) => {
  const renderElement = React.useCallback((props) => {
    return (
      <Box
        css={{
          display: 'flex',
          flexDirection: 'column',
          gap: '$2',
          '& > div': {
            flex: 1,
          },
        }}
      >
        <Box
          css={{
            display: 'flex',
            gap: '$2',
            '& > div': {
              flex: 1,
            },
          }}
        >
          {props.element.type !== 'list_item' && <MoveElement {...props} />}
          <Element {...props} />
        </Box>
        {props.element.type !== 'list_item' && <Controls {...props} />}
      </Box>
    )
  }, [])
  const renderLeaf = React.useCallback((props) => <Leaf {...props} />, [])
  const [editor] = React.useState(() =>
    withEditableVoids(withReact(createEditor()))
  )

  return (
    <>
      <Slate
        editor={editor}
        value={value}
        onChange={(val) => {
          // this will add an empty value at the end to make sure there's always space
          // addEmptySpace(editor)

          // but we want to remove it when it's sent back
          // onChange?.(removeLastEmptySpace(val))
          onChange?.(val)
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon={<TextBolder size={16} />} />
          <MarkButton format="italic" icon={<TextItalic size={16} />} />
          <MarkButton format="code" icon={<CodeSimple size={16} />} />
          <BlockButton format="heading_one" icon={<TextHOne size={16} />} />
          <BlockButton format="heading_two" icon={<TextHTwo size={16} />} />
          <BlockButton format="heading_three" icon={<TextHThree size={16} />} />
          <BlockButton format="block_quote" icon={<Quotes size={16} />} />
          <BlockButton format="ol_list" icon={<ListNumbers size={16} />} />
          <BlockButton format="ul_list" icon={<ListBullets size={16} />} />
          <StyledButton
            active={false}
            onMouseDown={(event) => {
              event.preventDefault()
              const text = { text: '' }
              const image: ImageElement = {
                type: 'image',
                link: null,
                title: '',
                caption: '',
                children: [text],
              }
              Transforms.insertNodes(editor, image)
            }}
          >
            <Image size={16} alt="image-icon" />
          </StyledButton>
          <ComponentButton />
        </Toolbar>
        <Box
          css={{
            '& > div': {
              padding: '$2',
            },
          }}
        >
          <Editable renderElement={renderElement} renderLeaf={renderLeaf} />
        </Box>
      </Slate>
    </>
  )
}

export default Editor
