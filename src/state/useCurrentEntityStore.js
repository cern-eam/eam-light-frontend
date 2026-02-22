import { create } from "zustand";

const useCurrentEntityStore = create((set) => ({
  currentEntity: null,
  setCurrentEntity: (entity) => set({ currentEntity: entity }),
}));

export default useCurrentEntityStore;
