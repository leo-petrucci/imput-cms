import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import remarkSlate, {
  defaultNodeTypes,
  serialize as remarkSerialize,
} from '../../../cms/components/editor/remark-slate'
import { createEditor, Descendant, Path } from 'slate'
import { withHistory } from 'slate-history'
import { Element } from '../../../cms/components/editor/element'
import MoveElement from '../../../cms/components/editor/moveElement'
import Controls from '../../../cms/components/editor/controls'
import { Leaf } from '../../../cms/components/editor/leaf'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { unified } from 'unified'
import debounce from 'lodash/debounce'
import { withListsPlugin } from './lists'
import {
  ListsEditor,
  onKeyDown as listsKeyDown,
  withListsReact,
} from '../../../cms/components/editor/slate-lists'
import { withInlines } from './button/link'
import { onKeyDownOffset } from './lib/keyDownOffset'
import { FloatingToolbar } from './floatingToolbar'
import { withImput } from './withImput'

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

  // we add ids to each node
  // because we then iterate through them with react
  // and we need something to use as key so rendering doesn't get weird
  result.map((r) => {
    // @ts-expect-error
    if (!r.id) {
      // @ts-expect-error
      r.id = uuidv4()
    }
  })

  return { result, response }
}

export const serialize = remarkSerialize

export interface EditorProps {
  value: Descendant[]
  onChange?: (value: Descendant[]) => void
  debug?: boolean
}

export const Editor = ({ value, onChange, debug }: EditorProps) => {
  const renderElement = React.useCallback((props: any) => {
    const path = ReactEditor.findPath(editor, props.element)

    // a level of 2 means it's a root element
    const displayControls = Path.levels(path).length === 2

    // this renders links and code_snippets as an inline element
    if (
      props.element.type === defaultNodeTypes.link ||
      props.element.type === defaultNodeTypes.code_snippet
    ) {
      return <Element {...props} />
    }

    return (
      <div className="imp-flex imp-flex-col imp-gap-2 children:imp-flex-1">
        <div className="imp-flex imp-gap-2 children:imp-flex-1">
          {displayControls && <MoveElement {...props} />}
          <Element {...props} />
        </div>
        {displayControls && <Controls {...props} />}
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const renderLeaf = React.useCallback((props: any) => <Leaf {...props} />, [])

  const [editor] = React.useState(
    () =>
      withInlines(
        withImput(
          withListsReact(
            withListsPlugin(withReact(withHistory(createEditor())))
          )
        )
      ) as ReactEditor & ListsEditor
  )

  const onEditorChange = (val: Descendant[]) => {
    console.log(val)
    onChange?.(val)
  }

  // can't update on every change in prod
  const debouncedOnChange = debug
    ? onEditorChange
    : debounce(onEditorChange, 100)

  /**
   * For debugging purposes, so onChange runs when the editor is first loaded
   */
  React.useEffect(() => {
    if (debug) {
      onChange?.(value)
    }
  }, [])

  return (
    <>
      <Slate editor={editor} value={value} onChange={debouncedOnChange}>
        <FloatingToolbar />
        <div className="children:imp-p-2">
          <Editable
            data-testid="slate-content-editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={(event: any) => {
              listsKeyDown(editor, event)
              onKeyDownOffset(editor, event)
            }}
          />
        </div>
      </Slate>
    </>
  )
}

export default Editor
