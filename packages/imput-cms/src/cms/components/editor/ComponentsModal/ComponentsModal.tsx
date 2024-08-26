import { ReactEditor, useSlate } from 'slate-react'
import { Transforms } from 'slate'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@imput/components/Dialog'
import { useCMS } from '../../../contexts/cmsContext/useCMSContext'
import { useModalStore } from './store'
import { useCommands } from '../Commands/hook'
import { selectCreatedNode } from '../utils/marksAndBlocks'
import { defaultNodeTypes } from '../remark-slate'

/**
 * Opens a component selection modal.
 */
export const ComponentsModal = () => {
  const editor = useSlate() as ReactEditor
  const { components, createComponent } = useCMS()
  const { editor: editorRef } = useCommands(editor)
  const { open, closeModal } = useModalStore()

  return (
    <>
      <Dialog open={open}>
        <DialogContent
          className="imp-min-w-screen imp-min-h-screen md:imp-min-w-[968px] md:imp-min-h-[524px]"
          onEscapeKeyDown={closeModal}
          onPointerDownOutside={closeModal}
          onCloseClick={closeModal}
        >
          <DialogHeader>
            <DialogTitle>Select a component</DialogTitle>
            <DialogDescription>
              Click on a component to add it to your document.
            </DialogDescription>
          </DialogHeader>
          <div className="imp-grid imp-grid-cols-1 imp-mt-4 md:imp-grid-cols-3 imp-gap-2 imp-max-h-[80vh] imp-overflow-auto">
            {components?.map((c) => (
              <button
                className="imp-inline-flex imp-p-4 imp-items-start imp-w-full imp-rounded-md imp-border imp-border-input imp-transition-colors imp-bg-background imp-shadow-sm hover:imp-bg-accent hover:imp-text-accent-foreground imp-cursor-pointer imp-overflow-hidden imp-relative"
                key={c.name}
                onClick={() => {
                  const component = createComponent(c.name)
                  if (component) {
                    Transforms.setNodes(editor, component)
                    closeModal()
                    selectCreatedNode(
                      editor,
                      editorRef!,
                      defaultNodeTypes.mdxJsxFlowElement,
                      'highest'
                    )
                  }
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
