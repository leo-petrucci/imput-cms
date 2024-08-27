import React from 'react'
import { useSlateSelection } from 'slate-react'
import { Portal } from '@imput/components/Portal'
import { useTextSelection } from '../../../utils/useTextSelection'
import { MarkButton } from '../button'
import { CodeSnippetButton, LinkButton } from '../button/button'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@imput/components/Popover'
import { TextBolder, TextItalic } from 'phosphor-react'

/**
 * A floating toolbar that only appears when text is selected
 */
const FloatingToolbar = () => {
  const selection = useSlateSelection()
  const popoverRef = React.useRef()

  const { clientRect } = useTextSelection()

  const [pointerUp, setPointerUp] = React.useState(false)

  React.useEffect(() => {
    const handlePointerUp = () => {
      setPointerUp(true)
    }
    const handlePointerDown = (event: any) => {
      if (!(popoverRef.current as any)?.contains(event.target))
        setPointerUp(false)
    }

    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  /**
   * Returns true if Slate selection length is 0
   */
  const nothingSelected = React.useMemo(() => {
    return selection
      ? selection!.anchor.offset - selection!.focus.offset === 0
      : true
  }, [selection])

  /**
   * Returns true if Slate selection length is 0
   * The first number of path is which paragraph is selected (I think)
   */
  const isSingleParagraphSelected = React.useMemo(() => {
    return selection
      ? selection.anchor.path[0] === selection.focus.path[0]
      : false
  }, [selection])

  if (
    !clientRect ||
    !selection ||
    // dont show the toolbar if nothing is selected
    nothingSelected ||
    // don't show the toolbar if multiple paragraphs are selected
    !isSingleParagraphSelected
  )
    return null

  if (!pointerUp) return null

  return (
    <Popover open>
      <Portal.Root>
        <PopoverAnchor asChild>
          <div
            className="imp-pointer-events-none"
            style={{
              height: clientRect.height,
              width: clientRect.width,
              left: clientRect.x,
              top: clientRect.y,
              position: 'absolute',
            }}
          ></div>
        </PopoverAnchor>
      </Portal.Root>
      <PopoverContent
        // @ts-ignore
        ref={popoverRef}
        side="top"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="!imp-p-0 imp-w-auto"
      >
        <div className="imp-flex">
          <MarkButton
            format="bold"
            icon={<TextBolder size={16} />}
            description="Bold"
            shortcut="⌘ + b"
          />
          <MarkButton
            format="italic"
            icon={<TextItalic size={16} />}
            description="Italic"
            shortcut="⌘ + i"
          />
          <CodeSnippetButton />
          <LinkButton />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { FloatingToolbar }
