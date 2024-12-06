import { create } from 'zustand';

const useEquipmentTreeStore = create((set) => ({
  equipmentTreeData: {
    showEqpTree: false
},
  updateEquipmentTreeData: (updatedData) =>
    set((state) => ({
      equipmentTreeData: { ...state.equipmentTreeData, ...updatedData },
    })),
}));

export default useEquipmentTreeStore;
