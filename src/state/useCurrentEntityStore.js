import { create } from "zustand";

const useCurrentEntityStore = create((set) => ({
  currentEntity: {},
  setCurrentEntity: (entity) => set({ currentEntity: entity }),
}));

export default useCurrentEntityStore;
