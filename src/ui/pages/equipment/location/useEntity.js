import {useState, useEffect, useRef} from "react"
import { useSelector, useDispatch } from "react-redux";
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../../selectors/uiSelectors'
import {useParams, useHistory} from "react-router-dom"
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import { assignDefaultValues, assignQueryParamValues } from "ui/pages/EntityTools";
import { setLayoutProperty, showError, showNotification, handleError, toggleHiddenRegion,
    setRegionVisibility } from "actions/uiActions";

const useEntity = (params) => {

    const {WS, postActions, entityDesc, entityURL, entityCodeProperty} = params;

    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState(null);
    const [errors, setErrors] = useState({});
    const [newEntity, setNewEntity] = useState(true);
    const {code} = useParams();
    const history = useHistory();
    const abortController = useRef(null);

    // Init dispatchers
    const dispatch = useDispatch();
    const setLayoutPropertyParam = (...args) => dispatch(setLayoutProperty(...args));
    const showNotificationParam = (...args) => dispatch(showNotification(...args));
    const showErrorParam = (...args) => dispatch(showError(...args));
    const handleErrorParam = (...args) => dispatch(handleError(...args));
    const toggleHiddenRegionParam = (...args) => dispatch(toggleHiddenRegion(...args));
    const setRegionVisibilityParam = (...args) => dispatch(setRegionVisibility(...args));

    // Fetch data from the redux store
    const screen = useSelector(state => state.application.userData.locationScreen);
    const screenLayout = useSelector(state => state.application.locationLayout);
    const entityScreen = useSelector(state => state.application.userData.screens[screen]);
    const userData = useSelector(state =>  state.application.userData);
    const applicationData = useSelector(state =>  state.application.applicationData);
    const showEqpTree = useSelector(state =>  state.ui.layout.showEqpTree);

    const departmentalSecurity = useState({})

    // HIDDEN REGIONS
    const isHiddenRegionParam = useSelector(state => isHiddenRegion(state)(screen))
    const getHiddenRegionStateParam = useSelector(state => getHiddenRegionState(state)(screen))
    const getUniqueRegionIDParam =  useSelector(state => getUniqueRegionID(state)(screen))


    useEffect( () => {
        if (code) {
            readEntity(code);
        } else {
            initNewEntity();
        }
    }, [code])

    const readEntity = (code) => {

        setLoading(true)

        // Cancel the old request in the case it was still active
        abortController.current?.abort();
        abortController.current = new AbortController();
        //
        WS.read(code, { signal: abortController.current.signal })
            .then(response => {
                setNewEntity(false);
                setEntity(response.body.data);
                postActions.read(response.body.data)

            })
            .catch(error => {
                if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                    handleErrorParam(error)
                }
            })
            .finally( () => setLoading(false))
    }


    const initNewEntity = () => {

        setLoading(true);

        WS.new()
            .then(response => {
                setNewEntity(true);
                let entity = assignValues(response.body.data)
                setEntity(entity);
                postActions.new(entity);
            })
            .catch(error => {
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }


    //
    // ASSIGN VALUES
    //
    const assignValues = entity => {
        //let layoutPropertiesMap = settings.layoutPropertiesMap;
        let queryParams = queryString.parse(window.location.search);

        //entity = assignDefaultValues(entity, screenLayout, layoutPropertiesMap);
        entity = assignQueryParamValues(entity, queryParams);
        return entity;
    }


    const createEntity = entity => {
        setLoading(true);

        WS.create(entity)
            .then(response => {
                const createdEntity = response.body.data;
                
                // Set new URL (will trigger a read)
                history.push(process.env.PUBLIC_URL + entityURL + encodeURIComponent(createdEntity[entityCodeProperty]));
                showNotification(entityDesc + ' ' + createdEntity[entityCodeProperty] + ' has been successfully created.');

            })
            .catch(error => {
                setErrors(error);
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }

    const saveHandler = () => {
        // Create new or update existing entity
        if (newEntity) {
            // 
            createEntity(entity)
        } else {
            //this.updateEntity(entity)
        }
    }

    const newHandler = () => {
        history.push(entityURL)
    }

    const deleteHandler = (code) => {
        WS.delete(code)
        .then(response => {
            // this.props.showNotification(this.settings.entityDesc + ' ' + code + ' has been successfully deleted.')
            newHandler();
        })
        .catch(error => {

        })
    }

    const updateEntityProperty = (key, value) => {
        setEntity(prevEntity => set({...prevEntity}, key, value));
    };



    return {screenLayout, entity, entityScreen, 
        newEntity, loading,
        userData, applicationData, 
        isHiddenRegion: isHiddenRegionParam, 
        getHiddenRegionState: getHiddenRegionStateParam, 
        getUniqueRegionID: getUniqueRegionIDParam, 
        
        setLayoutProperty: setLayoutPropertyParam,
        showEqpTree, departmentalSecurity, 
        // Dispatchers
        showError: showErrorParam, showNotification: showNotificationParam, handleError: handleErrorParam,
        toggleHiddenRegion: toggleHiddenRegionParam, setRegionVisibility: setRegionVisibilityParam,
        // 
        newHandler, saveHandler, deleteHandler, updateEntityProperty};

    
}

export default useEntity;