import {
  Atom,
  CodeBlock,
  TextHFive,
  TextHFour,
  TextHOne,
  TextHSix,
  TextHThree,
  TextHTwo,
} from '@imput/components/Icon'
import { Muted } from '@imput/components/Typography'
import { ReactEditor } from 'slate-react'
import { addCodeBlockNode, addHeadingNode } from '../utils/marksAndBlocks'
import { openComponentsModal } from '../ComponentsModal/store'

type OptionType = {
  value: any
  label: JSX.Element
  onSelect: (editor: ReactEditor, editorRef: HTMLElement) => void
}

export const CommandItem = ({
  icon,
  heading,
  sub,
}: {
  icon: JSX.Element
  heading: JSX.Element
  sub: JSX.Element
}) => {
  return (
    <div className="imp-flex imp-gap-2 imp-items-center">
      <div>{icon}</div>
      <div className="imp-flex imp-flex-col">
        <div className="imp-font-medium">{heading}</div>
        <Muted>{sub}</Muted>
      </div>
    </div>
  )
}

export const options: OptionType[] = [
  {
    label: (
      <CommandItem
        icon={<Atom size={32} />}
        heading={<>Component</>}
        sub={<>Transform this node into a component block.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      openComponentsModal()
    },
    value: 'component-block',
  },
  {
    label: (
      <CommandItem
        icon={<CodeBlock size={32} />}
        heading={<>Code Block</>}
        sub={<>Transform this node into a code block.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addCodeBlockNode(editor, editorRef)
    },
    value: 'code-block',
  },
  {
    label: (
      <CommandItem
        icon={<TextHOne size={32} />}
        heading={<>Heading 1</>}
        sub={<>Transform this node into a level one heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 1)
    },
    value: 'heading-1',
  },
  {
    label: (
      <CommandItem
        icon={<TextHTwo size={32} />}
        heading={<>Heading 2</>}
        sub={<>Transform this node into a level two heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 2)
    },
    value: 'heading-2',
  },
  {
    label: (
      <CommandItem
        icon={<TextHThree size={32} />}
        heading={<>Heading 3</>}
        sub={<>Transform this node into a level three heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 3)
    },
    value: 'heading-3',
  },
  {
    label: (
      <CommandItem
        icon={<TextHFour size={32} />}
        heading={<>Heading 4</>}
        sub={<>Transform this node into a level four heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 4)
    },
    value: 'heading-4',
  },
  {
    label: (
      <CommandItem
        icon={<TextHFive size={32} />}
        heading={<>Heading 5</>}
        sub={<>Transform this node into a level five heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 5)
    },
    value: 'heading-5',
  },
  {
    label: (
      <CommandItem
        icon={<TextHSix size={32} />}
        heading={<>Heading 6</>}
        sub={<>Transform this node into a level six heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor, editorRef) => {
      addHeadingNode(editor, editorRef, 6)
    },
    value: 'heading-6',
  },
]
