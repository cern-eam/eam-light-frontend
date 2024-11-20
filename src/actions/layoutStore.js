// store.js
import { create } from 'zustand';
import WS from "../tools/WS";

const screens = [
  {
    entity: "OBJ",
    userFunctionCode: "OSJOBS",
    systemFunctionCode: "OSJOBS",
    tabs: []
  }
];

const useLayoutStore = create((set) => ({
  screenLayout: null, // Updated to store layouts as a key-value pair
  fetchScreenLayout: async (userGroup) => {
    try {
      // Call WS.getScreenLayout for all screens in parallel
      const layouts = await Promise.all(
        screens.map(({ entity, userFunctionCode, systemFunctionCode, tabs }) =>
          WS.getScreenLayout(userGroup, entity, systemFunctionCode, userFunctionCode, tabs)
            .then((result) => ({ key: userFunctionCode, value: result.body.data }))
        )
      );

      // Convert array of results into an object and update the state
      const layoutsMap = layouts.reduce((acc, { key, value }) => {
        acc[key] = value;
        return acc;
      }, {});

      set({ screenLayout: layoutsMap });
    } catch (error) {
      console.error(`Error fetching screen layouts for userGroup "${userGroup}":`, error);
      set({ screenLayouts: {} });
    }
  },
}));

export default useLayoutStore;
