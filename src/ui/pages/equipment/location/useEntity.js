import {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../../selectors/uiSelectors'

const useEntity = () => {

    const screen = useSelector(state => state.application.userData.locationScreen);

    const screenLayout = useSelector(state => state.application.locationLayout);
    const entityScreen = useSelector(state => state.application.userData.screens[screen]);
    const userData = useSelector(state =>  state.application.userData);
    const applicationData = useSelector(state =>  state.application.applicationData);
    const showEqpTree = useSelector(state =>  state.ui.layout.showEqpTree);

    const departmentalSecurity = useState({})

    const toggleHiddenRegion = () => {}
    const setRegionVisibility = () => {}

    const isHiddenRegion2 = useSelector(state => isHiddenRegion(state)(screen))
    const getHiddenRegionState2 = useSelector(state => getHiddenRegionState(state)(screen))
    const getUniqueRegionID2 =  useSelector(state => getUniqueRegionID(state)(screen))

    const [layout, setLayout] = useState({})
    const [entity, setEntity] = useState({userDefinedFields: {}})

    const updateProperty = (valueKey, value) => {
        console.log('update property', valueKey, value)
    }

    return {screenLayout, layout, entity, entityScreen, 
        userData, applicationData, updateProperty, 
        isHiddenRegion2, getHiddenRegionState2, getUniqueRegionID2, showEqpTree, departmentalSecurity, toggleHiddenRegion, setRegionVisibility};

    
}

export default useEntity;