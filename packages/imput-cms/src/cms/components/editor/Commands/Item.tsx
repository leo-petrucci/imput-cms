import {
  Atom,
  CodeBlock,
  Image,
  TextHFive,
  TextHFour,
  TextHOne,
  TextHSix,
  TextHThree,
  TextHTwo,
  ListBullets,
  ListNumbers,
} from '@imput/components/Icon'
import { Muted } from '@imput/components/Typography'
import { ReactEditor } from 'slate-react'
import {
  addCodeBlockNode,
  addHeadingNode,
  addImageNode,
  selectCreatedNode,
} from '../utils/marksAndBlocks'
import { openComponentsModal } from '../ComponentsModal/store'
import { ListType, ListsEditor } from '../slate-lists'
import { increaseDepth } from '../slate-lists/transformations'
import { defaultNodeTypes } from '../remark-slate'

type OptionType = {
  value: any
  label: JSX.Element
  onSelect: (editor: ReactEditor) => void
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
      <div className="imp-text-muted-foreground">{icon}</div>
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
        icon={<ListNumbers size={24} />}
        heading={<>Numbered List</>}
        sub={<>Add a numbered list.</>}
      />
    ),
    // @ts-expect-error different type
    onSelect: (editor: ListsEditor, editorRef) => {
      increaseDepth(editor, ListType.ORDERED)
      selectCreatedNode(
        editor as unknown as ReactEditor,
        defaultNodeTypes.listItemText
      )
    },
    value: 'ol-block',
  },
  {
    label: (
      <CommandItem
        icon={<ListBullets size={24} />}
        heading={<>Bulletpoint List</>}
        sub={<>Add a bulletpoint list.</>}
      />
    ),
    // @ts-expect-error different type
    onSelect: (editor: ListsEditor) => {
      increaseDepth(editor, ListType.UNORDERED)
      selectCreatedNode(
        editor as unknown as ReactEditor,
        defaultNodeTypes.listItemText
      )
    },
    value: 'ul-block',
  },
  {
    label: (
      <CommandItem
        icon={<Atom size={24} />}
        heading={<>Custom Block</>}
        sub={<>Add a React component.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      openComponentsModal()
    },
    value: 'component-block',
  },
  {
    label: (
      <CommandItem
        icon={<Image size={24} />}
        heading={<>Image</>}
        sub={<>Add an image.</>}
      />
    ),
    onSelect: (editor) => {
      addImageNode(editor)
    },
    value: 'image-block',
  },
  {
    label: (
      <CommandItem
        icon={<CodeBlock size={24} />}
        heading={<>Code Block</>}
        sub={<>Add a code block.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addCodeBlockNode(editor)
    },
    value: 'code-block',
  },
  {
    label: (
      <CommandItem
        icon={<TextHOne size={24} />}
        heading={<>Heading 1</>}
        sub={<>Add a level one heading (largest).</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 1)
    },
    value: 'heading-1',
  },
  {
    label: (
      <CommandItem
        icon={<TextHTwo size={24} />}
        heading={<>Heading 2</>}
        sub={<>Add a level two heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 2)
    },
    value: 'heading-2',
  },
  {
    label: (
      <CommandItem
        icon={<TextHThree size={24} />}
        heading={<>Heading 3</>}
        sub={<>Add a level three heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 3)
    },
    value: 'heading-3',
  },
  {
    label: (
      <CommandItem
        icon={<TextHFour size={24} />}
        heading={<>Heading 4</>}
        sub={<>Add a level four heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 4)
    },
    value: 'heading-4',
  },
  {
    label: (
      <CommandItem
        icon={<TextHFive size={24} />}
        heading={<>Heading 5</>}
        sub={<>Add a level five heading.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 5)
    },
    value: 'heading-5',
  },
  {
    label: (
      <CommandItem
        icon={<TextHSix size={24} />}
        heading={<>Heading 6</>}
        sub={<>Add a level six heading (smallest).</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      addHeadingNode(editor, 6)
    },
    value: 'heading-6',
  },
]
