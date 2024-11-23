import { create } from 'zustand';
import WS from "../tools/WS";
import useUserDataStore from './useUserDataStore';

const useLayoutStore = create((set) => ({
  
  screenLayout: {}, 
  
  fetchScreenLayout: async (userGroup, entity, parentScreen, screen, tabs, screenProperty) => {
    try {
      //const {userData, setUserData} = useUserDataStore.getState();

      const newScreenLayout = await WS.getScreenLayout(userGroup, entity, parentScreen, screen, tabs)
      .then((result) => result.body.data);

      await set((state) => ({
        screenLayout: {
          ...state.screenLayout,
          [screen]: newScreenLayout,
        },
      }));

      //setUserData({[screenProperty]: userFunctionCode});
    } catch (error) {
      console.error(`Error fetching new screen layout:`, error);
    }
  },

}));

export default useLayoutStore;
