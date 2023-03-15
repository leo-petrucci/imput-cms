import React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { styled } from '@meow/stitches'
import { X } from 'phosphor-react'

const StyledPopoverContainer = styled('div', {
  variants: {
    displayAsMobile: {
      true: {
        '& div[data-radix-popper-content-wrapper]': {
          transform: 'translate3d(0px, 0, 0px)!important',
          width: '100%',
          bottom: 0,
          top: 'auto!important',
          maxWidth: 768,
        },
      },
    },
  },
})

const StyledPopoverContent = styled(PopoverPrimitive.Content, {
  zIndex: '$30',
  backgroundColor: '#fff',
  maxWidth: '100vw',
  boxShadow: '$md',
  borderTopLeftTadius: '$lg',
  borderTopRightRadius: '$lg',

  padding: '$4',

  '@md': {
    margin: 'initial',
    borderRadius: '$lg',
    maxWidth: 440,
  },
})

const StyledTooltipClose = styled(PopoverPrimitive.Close, {
  position: 'absolute',
  right: 0,
  top: 0,
  cursor: 'pointer',
  color: '$gray-600',
  background: 'transparent',
  border: 0,
  padding: '$2',
})

export interface TooltipProps extends PopoverPrimitive.PopoverContentProps {
  /**
   * Content to be displayed in the popover. If null is passed, popover won't display.
   */
  content: React.ReactNode | null
  /**
   * The component that the user will hover over to display the popover.
   */
  children?: React.ReactNode
}

/**
 * A reusable, accessible popover component built with Radix UI.
 * For documentation, read Radix docs https://www.radix-ui.com/docs/primitives/components/popover.
 */
const Popover = (
  { content, children, ...props }: TooltipProps = {
    content: null,
    side: 'top',
  }
): JSX.Element => {
  const { width } = useWindowSize()
  /**
   * We display a fixed tooltip only if the window width is between 0 and 768px.
   */
  const displayAsMobile = width !== undefined ? width > 0 && width < 768 : false

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
      {content !== null && (
        <PopoverPrimitive.Portal>
          <StyledPopoverContainer displayAsMobile={displayAsMobile}>
            <StyledPopoverContent {...props}>
              {content}
              {!displayAsMobile && (
                <PopoverPrimitive.Arrow
                  style={{
                    fill: 'white',
                  }}
                  offset={20}
                />
              )}
              <StyledTooltipClose>
                <X size={16} />
              </StyledTooltipClose>
            </StyledPopoverContent>
          </StyledPopoverContainer>
        </PopoverPrimitive.Portal>
      )}
    </PopoverPrimitive.Root>
  )
}

export default Popover

/**
 * Calculates browser's window size to decide whether to display a mobile version of the tooltip.
 *
 * Code from https://usehooks.com/useWindowSize/
 */
const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState<{
    width?: number
    height?: number
  }>({
    width: undefined,
    height: undefined,
  })
  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}
