import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash/debounce'

/**
 * Custom hook to manage draft functionality for a CMS.
 *
 * This hook allows saving an article draft to localStorage regularly, so that if something happens to the page or if the user isn't ready to publish the changes, they can keep the version they wrote without publishing it.
 *
 * @param {string} key - The key under which the draft will be saved in localStorage.
 * @returns {Object} An object containing the draft, a function to save the draft, and a function to clear the draft.
 * @returns {string} return.draft - The current draft.
 * @returns {function} return.saveDraft - Function to save the draft. Takes the new draft as an argument.
 * @returns {function} return.clearDraft - Function to clear the draft.
 */
const useDraft = (key: string) => {
  const [draft, setDraft] = useState<string>(() => {
    const savedDraft = localStorage.getItem(key)
    return savedDraft ? JSON.parse(savedDraft) : ''
  })

  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     const draftData = {
  //       content: draft,
  //       timestamp: new Date().toISOString(),
  //     }
  //     localStorage.setItem(key, JSON.stringify(draftData))
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload)

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [draft, key])

  const debouncedSaveDraft = useCallback(
    debounce((newDraft: string) => {
      localStorage.setItem(key, JSON.stringify(newDraft))
    }, 300),
    [key]
  )

  /**
   * Custom hook to manage draft functionality in a CMS.
   * This hook saves the draft to localStorage and retrieves it when needed.
   * It also debounces the save operation to avoid excessive writes to localStorage.
   *
   * @param {string} key - The key under which the draft is stored in localStorage.
   * @returns {Object} An object containing the draft, saveDraft, and clearDraft functions.
   */
  const saveDraft = (newDraft: string) => {
    // console.log('saving draft')
    setDraft(newDraft)
    debouncedSaveDraft(newDraft)
  }

  /**
   * Saves the draft to localStorage and updates the state.
   * This function is debounced to avoid excessive writes to localStorage.
   *
   * @param {string} newDraft - The new draft content to be saved.
   */

  /**
   * Clears the draft from both state and localStorage.
   */
  const clearDraft = () => {
    setDraft('')
    localStorage.removeItem(key)
  }

  /**
   * Checks whether a draft is already present in localStorage.
   *
   * @returns {boolean} A boolean indicating whether a draft is present.
   */
  const isDraftPresent = () => {
    const savedDraft = localStorage.getItem(key)
    console.log('isDraftPresent', savedDraft)
    return savedDraft !== null
  }

  return { draft, saveDraft, clearDraft, isDraftPresent }
}

export default useDraft
