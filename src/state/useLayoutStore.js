import { create } from 'zustand';
import WS from "../tools/WS";
import { TAB_CODES_ASSETS, TAB_CODES_LOCATIONS, TAB_CODES_NCR, TAB_CODES_PARTS, TAB_CODES_POSITIONS, TAB_CODES_SYSTEMS, TAB_CODES_WORK_ORDERS } from '../ui/components/entityregions/TabCodeMapping';
import useUserDataStore from './useUserDataStore';

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
  
  screenLayout: null, 
  
  fetchScreenLayoutFailed: false,
  
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

      await set((state) => ({
        screenLayout: {
          ...state.screenLayout,
          ...layoutsMap,
        },
        fetchScreenLayoutFailed: false,
      }));

    } catch (error) {
      console.error(`Error fetching screen layout`, error);
      set({
        screenLayout: {}, // Clear layouts on failure
        fetchScreenLayoutFailed: true, // Set the failure flag
      });
    }
  },

  fetchNewScreenLayout: async (userFunctionCode, tabs, screenProperty) => {
    try {
      const {userData, setUserData} = useUserDataStore.getState();

      const newLayout = await WS.getScreenLayout(userData.eamAccount.userGroup,
        userData.screens[userFunctionCode].entity,
        userData.screens[userFunctionCode].parentScreen,
        userFunctionCode,
        tabs
      ).then((result) => result.body.data);

      // await ensures that the setUserData will be called only when the state is updated
      await set((state) => ({
        screenLayout: {
          ...state.screenLayout,
          [userFunctionCode]: newLayout,
        },
      }));

      setUserData({[screenProperty]: userFunctionCode});
    } catch (error) {
      console.error(`Error fetching new screen layout:`, error);
    }
  },

}));

export default useLayoutStore;
