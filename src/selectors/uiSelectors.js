export const isHiddenRegion = (state) => (screen) => (regionID) => {
    return !!state.ui.hiddenRegions[getUniqueRegionID(state)(screen)(regionID)]
}

export const getUniqueRegionID = (state) => (screen) => (regionID) => {
    const user = state.application.userData.eamAccount.userCode
    return `${user}_${screen}_${regionID}`
}