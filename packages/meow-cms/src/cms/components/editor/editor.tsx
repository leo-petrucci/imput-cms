import React from 'react'
import remarkStringify from 'remark-stringify'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkSlate, {
  defaultNodeTypes,
  serialize as remarkSerialize,
} from '../../../cms/components/editor/remark-slate'
import { createEditor, Descendant, Path, Transforms } from 'slate'
import { Element } from '../../../cms/components/editor/element'
import MoveElement from '../../../cms/components/editor/moveElement'
import Controls from '../../../cms/components/editor/controls'
import { Leaf } from '../../../cms/components/editor/leaf'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { unified } from 'unified'
import debounce from 'lodash/debounce'
import Toolbar from '../../../cms/components/editor/toolbar'
import {
  BlockButton,
  ComponentButton,
  LinkButton,
  MarkButton,
  StyledButton,
} from '../../../cms/components/editor/button/button'
import {
  CodeSimple,
  Code,
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
import { Box } from '../'
import { ImageElement } from '../../../cms/components/editor/images/imageElement'
import { withListsPlugin } from './lists'
import {
  ListsEditor,
  onKeyDown as listsKeyDown,
  withListsReact,
} from '../../../cms/components/editor/slate-lists'
import { withInlines } from './button/link'
import { onKeyDownOffset } from './lib/keyDownOffset'

export const deserialize = (
  src: string
): {
  result: Descendant[]
  response: { status: 'ok' | 'error'; error?: Error }
} => {
  let result: Descendant[] = []
  let response: { status: 'ok' | 'error'; error?: Error }

  // handle the MDX parser failing
  // Sometimes there's literally nothing we can do on our side to fix it
  // so the best solution is return everything in plaintext and let the user sort it out
  try {
    const parsed = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkSlate)
      .processSync(src)

    result = parsed.result as Descendant[]
    response = { status: 'ok' }
  } catch (err) {
    const error = err as Error
    const parsed = unified().use(remarkParse).use(remarkSlate).processSync(src)

    result = parsed.result as Descendant[]
    response = { status: 'error', error }
  }

  return { result, response }
}

export const serialize = remarkSerialize

const withEditableVoids = (editor: ReactEditor) => {
  const { isVoid } = editor

  editor.isVoid = (element) => {
    // @ts-ignore
    return element.type === 'mdxJsxFlowElement' ||
      // @ts-ignore
      element.type === 'image'
      ? // @ts-ignore
        //  || element.type === 'code_block'
        true
      : isVoid(element)
  }

  return editor
}

export interface EditorProps {
  value: Descendant[]
  onChange?: (value: Descendant[]) => void
}

const Editor = ({ value, onChange }: EditorProps) => {
  const renderElement = React.useCallback((props: any) => {
    const path = ReactEditor.findPath(editor, props.element)

    // a level of 2 means it's a root element
    const displayControls = Path.levels(path).length === 2

    if (props.element.type === defaultNodeTypes.link) {
      return <Element {...props} />
    }

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
          {displayControls && <MoveElement {...props} />}
          <Element {...props} />
        </Box>
        {displayControls && <Controls {...props} />}
      </Box>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const renderLeaf = React.useCallback((props: any) => <Leaf {...props} />, [])

  const [editor] = React.useState(
    () =>
      withInlines(
        withEditableVoids(
          withListsReact(withListsPlugin(withReact(createEditor())))
        )
      ) as ReactEditor & ListsEditor
  )

  const onEditorChange = (val: Descendant[]) => {
    console.log(val)
    onChange?.(val)
  }

  const debouncedOnChange = debounce(onEditorChange, 100)

  return (
    <>
      <Slate editor={editor} value={value} onChange={debouncedOnChange}>
        <Toolbar>
          <MarkButton format="bold" icon={<TextBolder size={16} />} />
          <MarkButton format="italic" icon={<TextItalic size={16} />} />
          <MarkButton format="code" icon={<CodeSimple size={16} />} />
          <LinkButton />
          <BlockButton format="code_block" icon={<Code size={16} />} />
          <BlockButton format="heading_one" icon={<TextHOne size={16} />} />
          <BlockButton format="heading_two" icon={<TextHTwo size={16} />} />
          <BlockButton format="heading_three" icon={<TextHThree size={16} />} />
          <BlockButton format="block_quote" icon={<Quotes size={16} />} />
          <BlockButton format="ol_list" icon={<ListNumbers size={16} />} />
          <BlockButton format="ul_list" icon={<ListBullets size={16} />} />
          <StyledButton
            type="button"
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
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event: any) => {
              listsKeyDown(editor, event)
              onKeyDownOffset(editor, event)
            }}
          />
        </Box>
      </Slate>
    </>
  )
}

export default Editor
