import { create } from "zustand";

const useMenuVisibilityStore = create((set) => ({
    menuVisibility: {
        mywos: true,
        myteamwos: false,
        workorders: false,
        equipment: false,
        materials: false,
        customgrids: false,
        settings: false,
        equipmentAssets: false,
        equipmentNcrs: false,
        equipmentPositions: false,
        equipmentSystems: false,
        equipmentLocations: false,
    },
    setActiveMenuVisibility: (menuId) => {
        set((state) => ({
            menuVisibility: {
                ...Object.keys(state.menuVisibility).reduce((acc, key) => {
                    acc[key] = menuId === key;
                    return acc;
                }, {}),
            },
        }));
    },
}));

export default useMenuVisibilityStore;
