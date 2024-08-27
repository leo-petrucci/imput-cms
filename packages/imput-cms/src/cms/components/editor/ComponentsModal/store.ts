import { create } from 'zustand'

// Define the store
interface ModalStore {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}))

export const openComponentsModal = () => {
  useModalStore.getState().openModal()
}

export const closeComponentsModal = () => {
  useModalStore.getState().closeModal()
}
