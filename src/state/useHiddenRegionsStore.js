import { create } from "zustand";

export const getUniqueRegionID = (screen, userCode) => (regionID) =>
  `${userCode}_${screen}_${regionID}`;

export const useHiddenRegionsStore = create(() => ({
  hiddenRegions: JSON.parse(localStorage.getItem("hiddenRegions")) || {},
  initialHiddenRegions: JSON.parse(localStorage.getItem("initialHiddenRegions")) || {},
  isHiddenRegion: (screen, userCode) => (regionID) => {
    const id = getUniqueRegionID(screen, userCode)(regionID);
    const state = useHiddenRegionsStore.getState();
    // isHiddenRegion uses the initial visibility only when the user
    // has no saved checkbox preference for the region. User preferences
    // always take precedence.
    return state.hiddenRegions[id] ?? state.initialHiddenRegions[id];
  },

  setRegionVisibility: (regionID, isVisible) => {
    useHiddenRegionsStore.setState((state) => {
      const updatedHiddenRegions = {
        ...state.hiddenRegions,
        [regionID]: isVisible, // Directly use regionID here
      };
      localStorage.setItem(
        "hiddenRegions",
        JSON.stringify(updatedHiddenRegions)
      );
      return { hiddenRegions: updatedHiddenRegions };
    });
  },
    // Persist the default (initial) visibility for each region.
    setInitialVisibility: (regionID, isVisible) => {
    if(isVisible === undefined) return;
    useHiddenRegionsStore.setState((state) => {
      const updatedInitialHiddenRegions = {
        ...state.initialHiddenRegions,
        [regionID]: isVisible,
      };
      localStorage.setItem(
        "initialHiddenRegions",
        JSON.stringify(updatedInitialHiddenRegions)
      );
      return { initialHiddenRegions: updatedInitialHiddenRegions };
    });
  },
}));
