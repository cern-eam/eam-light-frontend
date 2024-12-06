import { create } from "zustand";

const useWorkOrderStore = create((set) => ({
  currentWorkOrder: "",
  setCurrentWorkOrder: (workOrder) => set({ currentWorkOrder: workOrder }),
}));

export default useWorkOrderStore;
