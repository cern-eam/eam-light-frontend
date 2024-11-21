// store.js
import { create } from 'zustand';
import WS from "../tools/WS";
import { TAB_CODES_ASSETS, TAB_CODES_LOCATIONS, TAB_CODES_NCR, TAB_CODES_PARTS, TAB_CODES_POSITIONS, TAB_CODES_SYSTEMS, TAB_CODES_WORK_ORDERS } from '../ui/components/entityregions/TabCodeMapping';

const screens = (userData) => ([
  {
    entity: "OBJ",
    userFunctionCode: "OSJOBS",
    systemFunctionCode: "OSJOBS",
    tabs: []
  },
  {
    entity: "EVNT",
    userFunctionCode: userData.workOrderScreen,
    systemFunctionCode: "WSJOBS",
    tabs: TAB_CODES_WORK_ORDERS
  },
  {
    entity: "NOCF",
    userFunctionCode: userData.ncrScreen,
    systemFunctionCode: "OSNCHD",
    tabs: TAB_CODES_NCR
  },
  {
    entity: "OBJ",
    userFunctionCode: userData.locationScreen,
    systemFunctionCode: "OSOBJL",
    tabs: TAB_CODES_LOCATIONS
  },
  {
    entity: "PART",
    userFunctionCode: userData.partScreen,
    systemFunctionCode: "SSPART",
    tabs: TAB_CODES_PARTS
  },
  {
    entity: "OBJ",
    userFunctionCode: userData.assetScreen,
    systemFunctionCode: "OSOBJA",
    tabs: TAB_CODES_ASSETS
  },
  {
    entity: "OBJ",
    userFunctionCode: userData.positionScreen,
    systemFunctionCode: "OSOBJP",
    tabs: TAB_CODES_POSITIONS
  },
  {
    entity: "OBJ",
    userFunctionCode: userData.systemScreen,
    systemFunctionCode: "OSOBJS",
    tabs: TAB_CODES_SYSTEMS
  }
]);

const useLayoutStore = create((set) => ({
  screenLayout: null, // Updated to store layouts as a key-value pair
  
  fetchScreenLayout: async (userData) => {
    try {
      // Call WS.getScreenLayout for all screens in parallel
      const layouts = await Promise.all(
        screens(userData).map(({ entity, userFunctionCode, systemFunctionCode, tabs }) =>
          WS.getScreenLayout(userData.eamAccount.userGroup, entity, systemFunctionCode, userFunctionCode, tabs)
            .then((result) => ({ key: userFunctionCode, value: result.body.data }))
        )
      );

      // Convert array of results into an object 
      const layoutsMap = layouts.reduce((acc, { key, value }) => {acc[key] = value; return acc;}, {});
      set({ screenLayout: layoutsMap });
    } catch (error) {
      console.error(`Error fetching screen layouts for userGroup "${userGroup}":`, error);
      set({ screenLayouts: {} });
    }
  },

  fetchNewScreenLayout: async (...args) => {
    try {
      console.log("fetch new layout", args)
      const newLayout = await WS.getScreenLayout(...args).then((result) => result.body.data);

      set((state) => ({
        screenLayout: {
          ...state.screenLayout,
          newScreenLayout: newLayout,
        },
      }));
    } catch (error) {
      console.error(`Error fetching new screen layout:`, error);
    }
  },

}));

export default useLayoutStore;
