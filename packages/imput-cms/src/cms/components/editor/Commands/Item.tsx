import { CodeBlock } from '@imput/components/Icon'
import { Muted, Small } from '@imput/components/Typography'
import { Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { v4 as uuidv4 } from 'uuid'
import { toggleBlock } from '../utils/marksAndBlocks'

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
        icon={<CodeBlock size={32} />}
        heading={<>Code Block</>}
        sub={<>Transform this node into a code block.</>}
      />
    ),
    onSelect: (editor: ReactEditor) => {
      const { selection } = editor

      toggleBlock(editor, 'code_block')

      Transforms.setNodes(
        editor,
        {
          // @ts-ignore
          type: 'code_block',
          language: 'plain',
        },
        { at: [selection!.anchor.path[0]] }
      )
    },
    value: 'code-block',
  },
]
