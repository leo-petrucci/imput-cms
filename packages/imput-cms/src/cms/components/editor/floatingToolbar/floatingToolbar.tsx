import React from 'react'
import { useSlateSelection } from 'slate-react'
import { Portal } from '@imput/components/Portal'
import { useTextSelection } from '../../../utils/useTextSelection'
import { MarkButton } from '../button'
import { BlockButton, LinkButton } from '../button/button'
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@imput/components/Popover'
import {
  CodeSimple,
  Code,
  ListBullets,
  ListNumbers,
  Quotes,
  TextBolder,
  TextHOne,
  TextHThree,
  TextHTwo,
  TextItalic,
} from 'phosphor-react'

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
            className="pointer-events-none"
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
        className="p-0 w-auto"
      >
        <div className="flex">
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
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { FloatingToolbar }
