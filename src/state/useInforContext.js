import {create} from "zustand";

const useInforContextStore = create((set) => ({
  inforContext: null,
  setInforContext: (context) => set({ inforContext: context })
}));

export default useInforContextStore;
