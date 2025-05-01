import { create } from 'zustand';

export const useCustomFieldOptionsStore = create((set) => ({
  cache: {},
  setCache: (code, options) =>
    set((state) => ({
      cache: { ...state.cache, [code]: options }
    })),
}));