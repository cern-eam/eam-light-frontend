import {create} from "zustand";

const useInforContextStore = create((set) => ({
  infoContext: null,
  setInfoContext: (context) => set({ infoContext: context })
}));

export default useInforContextStore;
