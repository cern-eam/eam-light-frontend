import { create } from "zustand";
import WS from "../tools/WS";

const useLayoutStore = create((set) => ({
  screenLayout: {},
  screenLayoutFetchError: false, // Add a boolean property to track fetch errors

  fetchScreenLayout: async (
    userGroup,
    entity,
    parentScreen,
    screen,
    tabs,
    screenProperty
  ) => {
    try {
      let newScreenLayout = await WS.getScreenLayout(
        userGroup,
        entity,
        parentScreen,
        screen,
        tabs
      ).then((result) => result.body.data);
      if (screen === "OSOBJA") {
        delete newScreenLayout.customGridTabs.XDP;
      } else if (screen === "OSOBJP") {
        delete newScreenLayout.customGridTabs.XPI;
        delete newScreenLayout.customGridTabs.XPM;
      }

      set((state) => ({
        screenLayout: {
          ...state.screenLayout,
          [screen]: newScreenLayout,
        },
        screenLayoutFetchError: false, // Clear error state on successful fetch
      }));
    } catch (error) {
      console.error(`Error fetching new screen layout:`, error);
      set({ screenLayoutFetchError: true }); // Set error state to true on failure
    }
  },
}));

export default useLayoutStore;
