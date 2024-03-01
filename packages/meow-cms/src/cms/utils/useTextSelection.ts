import React, { useCallback, useLayoutEffect, useState } from 'react'

type ClientRect = Record<keyof Omit<DOMRect, 'toJSON'>, number>

function roundValues(_rect: ClientRect) {
  const rect = {
    ..._rect,
  }
  for (const key of Object.keys(rect)) {
    // @ts-ignore
    rect[key] = Math.round(rect[key])
  }
  return rect
}

function shallowDiff(prev: any, next: any) {
  if (prev != null && next != null) {
    for (const key of Object.keys(next)) {
      if (prev[key] != next[key]) {
        return true
      }
    }
  } else if (prev != next) {
    return true
  }
  return false
}

type TextSelectionState = {
  clientRect?: ClientRect
  isCollapsed?: boolean
  textContent?: string
}

const defaultState: TextSelectionState = {}

/**
 * useTextSelection(ref)
 *
 * @description
 * hook to get information about the current text selection
 *
 */
export function useTextSelection(target?: HTMLElement) {
  const [{ clientRect, isCollapsed, textContent }, setState] =
    useState<TextSelectionState>(defaultState)

  const scrollableParentRef = React.useRef<Element | null>()

  const reset = useCallback(() => {
    setState(defaultState)
  }, [])

  /**
   * Returns the first scrollable parent of the item being selected
   * in our case it would be the editor
   */
  function getScrollParent(node: Element) {
    if (node == null) {
      return null
    }

    if (node.scrollHeight > node.clientHeight) {
      return node
    } else {
      return getScrollParent(node.parentNode as Element)
    }
  }

  const handler = useCallback(() => {
    let newRect = null as null | ClientRect
    const selection = window.getSelection()
    let newState: TextSelectionState = {}

    if (selection == null || !selection.rangeCount) {
      setState(newState)
      return
    }

    const range = selection.getRangeAt(0)

    // we try and find the first scrollable parent so we can add scroll listeners to it
    const scrollableParent = getScrollParent(range.startContainer as Element)
    scrollableParentRef.current = scrollableParent

    if (target != null && !target.contains(range.commonAncestorContainer)) {
      setState(newState)
      return
    }

    if (range == null) {
      setState(newState)
      return
    }

    const contents = range.cloneContents()

    if (contents.textContent != null) {
      newState.textContent = contents.textContent
    }

    const rects = range.getClientRects()

    if (rects.length === 0 && range.commonAncestorContainer != null) {
      const el = range.commonAncestorContainer as HTMLElement
      if (el.getBoundingClientRect)
        newRect = roundValues(el.getBoundingClientRect().toJSON())
    } else {
      if (rects.length < 1) return
      newRect = roundValues(rects[0].toJSON())
    }
    if (newRect)
      if (shallowDiff(clientRect, newRect)) {
        newState.clientRect = newRect
      }
    newState.isCollapsed = range.collapsed

    setState(newState)
  }, [target])

  useLayoutEffect(() => {
    document.addEventListener('selectionchange', handler)
    document.addEventListener('keydown', handler)
    document.addEventListener('keyup', handler)
    window.addEventListener('resize', handler)

    return () => {
      document.removeEventListener('selectionchange', handler)
      document.removeEventListener('keydown', handler)
      document.removeEventListener('keyup', handler)
      window.removeEventListener('resize', handler)
    }
  }, [target])

  // add a scroll listener to the parent, so the item follows with scrolling
  useLayoutEffect(() => {
    scrollableParentRef.current?.addEventListener('scroll', handler)
    return () => {
      scrollableParentRef.current?.removeEventListener('scroll', handler)
    }
  }, [clientRect, isCollapsed, textContent])

  return {
    clientRect,
    isCollapsed,
    textContent,
  }
}
