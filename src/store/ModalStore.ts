import { create } from "zustand";
import { ITodo } from "../types";

export interface IModalState {
  isOpen: boolean;
  todo: null | { index: number} & ITodo;
  openModal: (todo?: { index: number} & ITodo) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalState>()((set) => ({
  isOpen: false,
  todo: null,
  openModal: (todo) => {
    if (todo) {
      set({ todo })
    }
    set({ isOpen: true })
  },
  closeModal: () => set({ isOpen: false, todo: null}),
}))