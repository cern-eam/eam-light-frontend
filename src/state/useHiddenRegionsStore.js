import {create} from 'zustand';

export const getUniqueRegionID = (screen) => (regionID) => `${screen}_${regionID}`;

export const useHiddenRegionsStore = create(() => ({
  hiddenRegions: JSON.parse(localStorage.getItem('hiddenRegions')) || {},

  isHiddenRegion: (screen) => (regionID) => {
    const id = getUniqueRegionID(screen)(regionID);
    const state = useHiddenRegionsStore.getState();
    //console.log('isHiddenRegion', screen, regionID, !!state.hiddenRegions[id]);
    return !!state.hiddenRegions[id];
  },

  setRegionVisibility: (regionID, isVisible) => {
    //console.log('set', regionID, isVisible);
    useHiddenRegionsStore.setState((state) => {
      const updatedHiddenRegions = {
        ...state.hiddenRegions,
        [regionID]: isVisible, // Directly use regionID here
      };
      localStorage.setItem('hiddenRegions', JSON.stringify(updatedHiddenRegions));
      return { hiddenRegions: updatedHiddenRegions };
    });
  },

}));
