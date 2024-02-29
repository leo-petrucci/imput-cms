import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { useSlate, useSlateSelection } from 'slate-react'
import { Portal } from '@meow/components/Portal'
import { cn } from '@meow/components/lib/utils'
import { useTextSelection } from '../../../utils/useTextSelection'
import { MarkButton } from '../button'
import { BlockButton, ComponentButton, LinkButton } from '../button/button'
import Toggle from '@meow/components/Toggle'
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
import { Transforms } from 'slate'
import { ImageElement } from '../images/imageElement'

/**
 * This component handles selections in the editor
 */
const FloatingToolbar = () => {
  const editor = useSlate()
  const selection = useSlateSelection()
  const popoverRef = React.useRef()

  console.log(selection?.anchor.path, selection?.focus.path)

  const { clientRect, isCollapsed } = useTextSelection()

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
    <PopoverPrimitive.Root open>
      <Portal.Root>
        <PopoverPrimitive.Anchor asChild>
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
        </PopoverPrimitive.Anchor>
      </Portal.Root>
      {/* @ts-ignore */}
      <PopoverContent ref={popoverRef} side="top">
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
          <Toggle
            pressed={false}
            onPressedChange={() => {
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
          </Toggle>
          <ComponentButton />
        </div>
      </PopoverContent>
    </PopoverPrimitive.Root>
  )
}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))

export { FloatingToolbar }
