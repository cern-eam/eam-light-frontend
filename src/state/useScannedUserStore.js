import {create} from "zustand";

const useScannedUserStore = create((set) => ({
  scannedUser: null,
  setScannedUser: (data) => set({ scannedUser: data })
}));

export default useScannedUserStore;
