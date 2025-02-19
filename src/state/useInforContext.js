import {create} from "zustand";

const useInforContextStore = create((set) => {
  const storedContext = sessionStorage.getItem("inforContext");

  return {
    inforContext: storedContext ? JSON.parse(storedContext) : null,
    setInforContext: (context) => {
      sessionStorage.setItem("inforContext", JSON.stringify(context));
      set({ inforContext: context });
    },
  }
});

export default useInforContextStore;