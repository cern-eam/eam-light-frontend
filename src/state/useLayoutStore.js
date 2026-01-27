import { create } from "zustand";
import WS from "../tools/WS";

const applyOverrides = (screenLayout, screen, parentScreen) => {
  if (screen === "OSOBJA") {
    delete screenLayout.customGridTabs.XDP;
  } else if (screen === "OSOBJP") {
    delete screenLayout.customGridTabs.XPI;
    delete screenLayout.customGridTabs.XPM;
  } else if (parentScreen === "WSJOBS") {
    ['actioncode', 'causecode', 'failurecode', 'failuremodedesc', 'humanfactor', 'humanoversight', 'methodofdetection', 'problemcode', 'symptom', 'tacticalcause', 'workmanship']
      .forEach(f => { if (screenLayout.fields?.[f]) screenLayout.fields[f].fieldContainer = 'cont_99'; });
  }
  return screenLayout;
};

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
      
      newScreenLayout = applyOverrides(newScreenLayout, screen, parentScreen);

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
