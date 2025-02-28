import { create } from 'zustand';

const useEquipmentTreeStore = create((set) => ({
  equipmentTreeData: {
    showEqpTree: false,
  },
  initializeStore: (userCode) => {
    const showEqpTreeKey = `showEqpTree:${userCode}`;
    const storedShowEqpTree = localStorage.getItem(showEqpTreeKey) === 'true';

    set({
      equipmentTreeData: { showEqpTree: storedShowEqpTree },
      showEqpTreeKey,
    });
  },
  updateEquipmentTreeData: (updatedData) => {
    set((state) => {
      if (updatedData.hasOwnProperty('showEqpTree') && state.showEqpTreeKey) {
        localStorage.setItem(state.showEqpTreeKey, updatedData.showEqpTree);
      }
      return { equipmentTreeData: { ...state.equipmentTreeData, ...updatedData } };
    });
  },
}));

export default useEquipmentTreeStore;
