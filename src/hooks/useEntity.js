import {useState, useEffect, useRef} from "react"
import { useSelector, useDispatch } from "react-redux";
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../selectors/uiSelectors'
import {useParams, useHistory} from "react-router-dom"
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import { assignDefaultValues, assignQueryParamValues, assignCustomFieldFromCustomField, assignCustomFieldFromObject, AssignmentType, fireHandlers, isDepartmentReadOnly } from "ui/pages/EntityTools";
import { setLayoutProperty, showError, showNotification, handleError, toggleHiddenRegion,
    setRegionVisibility, 
    showWarning} from "actions/uiActions";
import WSCustomFields from "tools/WSCustomFields";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";

const useEntity = (params) => {

    const {WS, postActions, handlers, entityCode, entityDesc, entityURL, entityCodeProperty, screenProperty, layoutProperty, layoutPropertiesMap, isReadOnlyCustomHandler} = params;

    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState(null);
    const [errors, setErrors] = useState([]);
    const [newEntity, setNewEntity] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const {code} = useParams();
    const history = useHistory();
    const abortController = useRef(null);
    const commentsComponent = useRef(null);
    const departmentalSecurity = useState({});

    // Init dispatchers
    const dispatch = useDispatch();
    const setLayoutPropertyParam = (...args) => dispatch(setLayoutProperty(...args));
    const showNotificationParam = (...args) => dispatch(showNotification(...args));
    const showErrorParam = (...args) => dispatch(showError(...args));
    const showWarningParam = (...args) => dispatch(showWarning(...args));
    const handleErrorParam = (...args) => dispatch(handleError(...args));
    const toggleHiddenRegionParam = (...args) => dispatch(toggleHiddenRegion(...args));
    const setRegionVisibilityParam = (...args) => dispatch(setRegionVisibility(...args));

    // Fetch data from the redux store
    const screenCode = useSelector(state => state.application.userData[screenProperty]);
    const screenLayout = useSelector(state => state.application[layoutProperty]);
    const screenPermissions = useSelector(state => state.application.userData.screens[screenCode]);
    const userData = useSelector(state =>  state.application.userData);
    const applicationData = useSelector(state =>  state.application.applicationData);
    const showEqpTree = useSelector(state =>  state.ui.layout.showEqpTree);

    // HIDDEN REGIONS
    const isHiddenRegionParam = useSelector(state => isHiddenRegion(state)(screenCode))
    const getHiddenRegionStateParam = useSelector(state => getHiddenRegionState(state)(screenCode))
    const getUniqueRegionIDParam =  useSelector(state => getUniqueRegionID(state)(screenCode))

    useEffect( () => code ? readEntity(code) : initNewEntity(), [code])

    //
    // CRUD
    //
    const createEntity = () => {
        setLoading(true);
        WS.create(entity)
            .then(response => {
                const createdEntity = response.body.data;
                setEntity(createdEntity)
                setNewEntity(false)
                window.history.pushState({}, '', process.env.PUBLIC_URL + entityURL + encodeURIComponent(createdEntity[entityCodeProperty]));
                showNotificationParam(entityDesc + ' ' + createdEntity[entityCodeProperty] + ' has been successfully created.');
                document.title = entityDesc + ' ' + createdEntity[entityCodeProperty];
                // Render as read-only depending on screen rights, department security or custom handler
                setReadOnly(!screenPermissions.updateAllowed || isDepartmentReadOnly(data.departmentCode, userData) || isReadOnlyCustomHandler?.(data))
                postActions.create(createdEntity);
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }

    const readEntity = (code) => {
        setLoading(true)
        // Cancel the old request in the case it was still active
        abortController.current?.abort();
        abortController.current = new AbortController();
        //
        WS.read(code, { signal: abortController.current.signal })
            .then(response => {
                setNewEntity(false);
                let data = response.body.data;
                setEntity(data);
                document.title = entityDesc + ' ' + data[entityCodeProperty];
                // Render as read-only depending on screen rights, department security or custom handler
                setReadOnly(!screenPermissions.updateAllowed || isDepartmentReadOnly(data.departmentCode, userData) || isReadOnlyCustomHandler?.(data))
                postActions.read(data)
            })
            .catch(error => {
                if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                    handleErrorParam(error)
                }
            })
            .finally( () => setLoading(false))
    }

    const updateEntity = () => {
        setLoading(true);
        setErrors(null);
        WS.update(entity)
            .then(response => {
                const data = response.body.data;
                setEntity(data);
                showNotificationParam(`${entityDesc} ${data[entityCodeProperty]} has been successfully updated.`);
                // Render as read-only depending on screen rights, department security or custom handler
                setReadOnly(!screenPermissions.updateAllowed || 
                            isDepartmentReadOnly(data.departmentCode, userData) || 
                            isReadOnlyCustomHandler?.(data))
                // Invoke entity specific logic 
                postActions.update(data)
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }

    const deleteEntity = () => {
        setLoading(true)
        WS.delete(entity[entityCodeProperty])
            .then(response => {
                showNotificationParam(`${entityDesc} ${entity[entityCodeProperty]} has been successfully deleted.`);
                initNewEntity();
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }

    const initNewEntity = () => {
        setLoading(true);
        WS.new()
            .then(response => {
                setNewEntity(true);
                let entity = response.body.data;
                entity = assignDefaultValues(entity, screenLayout, layoutPropertiesMap);
                entity = assignQueryParamValues(entity);
                setEntity(entity);
                fireHandlers(entity, getHandlers());
                document.title = 'New ' + entityDesc;
                postActions.new(entity);
            })
            .catch(error => {
                handleErrorParam(error)
            })
            .finally( () => setLoading(false))
    }

    const copyEntity = () => {
        let code = entity[entityCodeProperty];
        setNewEntity(true);
        setEntity( oldEntity => ({
            ...assignDefaultValues(oldEntity,
                screenLayout,
                layoutPropertiesMap),
            copyFrom: code
        }))
        postActions?.copy?.();
    }

    //
    // BUTTON HANDLERS
    //
    const saveHandler = () => newEntity ? createEntity() : updateEntity();
        
    const newHandler = () => history.push(entityURL);

    const deleteHandler = () => deleteEntity();

    const copyHandler = () => copyEntity();

    //
    // HELPER METHODS
    //
    const onChangeClass = newClass => {
        return WSCustomFields.getCustomFields(entityCode, newClass)
        .then(response => {
            setEntity(prevEntity => {
                const newCustomFields = response.body.data;
                let entity = assignCustomFieldFromCustomField(prevEntity, newCustomFields, AssignmentType.SOURCE_NOT_EMPTY);
    
                // replace custom fields with ones in query parameters if we have just created the entity
                if(newEntity) {
                    const queryParams = queryString.parse(window.location.search);
                    entity = assignCustomFieldFromObject(entity, queryParams, AssignmentType.SOURCE_NOT_EMPTY);
                }
                return entity;
            });
        })
        .catch(console.error)
    }

    const updateEntityProperty = (key, value) => {
        setEntity(prevEntity => set({...prevEntity}, key, value));
        // Fire handler for the 'key'
        getHandlers()[key]?.(value);
    };

    const register = (layoutKey, valueKey, descKey) => {
        let data = processElementInfo(screenLayout.fields[layoutKey])
        console.log("elem", screenLayout.fields[layoutKey])
        data.updateProperty = updateEntityProperty;
        data.disabled = data.disabled || readOnly; // It should remain disabled 
        data.elementInfo = screenLayout.fields[layoutKey]; // Return elementInfo as it is still needed in some cases (for example for UDFs)
        // Value
        data.value = get(entity, valueKey);
        data.valueKey = valueKey;
        // Description 
        if (descKey) {
            data.desc = get(entity, descKey);
            data.descKey = descKey;
        }
        // Errors
        let error = errors?.find?.(e => e.location === data.id);
        if (error) {
            data.errorText = error.message;
        }
        return data;
    }

    const getHandlers = () => ({...handlers, "classCode": onChangeClass});
    
    //
    //
    //
    return {screenCode, screenLayout, screenPermissions, 
        entity, newEntity, setEntity, loading, readOnly, 
        userData, applicationData, 
        isHiddenRegion: isHiddenRegionParam, 
        getHiddenRegionState: getHiddenRegionStateParam, 
        getUniqueRegionID: getUniqueRegionIDParam, 
        commentsComponent,
        setLayoutProperty: setLayoutPropertyParam,
        showEqpTree, departmentalSecurity, 
        // Dispatchers
        showError: showErrorParam, showNotification: showNotificationParam, handleError: handleErrorParam, showWarning: showWarningParam,
        toggleHiddenRegion: toggleHiddenRegionParam, setRegionVisibility: setRegionVisibilityParam,
        // 
        newHandler, saveHandler, deleteHandler, copyHandler, updateEntityProperty, register};

}

export default useEntity;