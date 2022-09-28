import {useState, useEffect, useRef} from "react"
import { useSelector, useDispatch } from "react-redux";
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../selectors/uiSelectors'
import {useParams, useHistory} from "react-router-dom"
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import { assignDefaultValues, assignQueryParamValues, assignCustomFieldFromCustomField, assignCustomFieldFromObject, AssignmentType, fireHandlers, isDepartmentReadOnly, getElementInfoForCustomField } from "ui/pages/EntityTools";
import { setLayoutProperty, showError, showNotification, handleError, toggleHiddenRegion,
    setRegionVisibility, 
    showWarning} from "actions/uiActions";
import WSCustomFields from "tools/WSCustomFields";
import { createOnChangeHandler, processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";

const useEntity = (params) => {

    const {WS, postActions, handlers, entityCode, entityDesc, entityURL, entityCodeProperty, screenProperty, layoutProperty, layoutPropertiesMap, isReadOnlyCustomHandler} = params;

    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState(null);
    const [errors, setErrors] = useState(null);
    const [newEntity, setNewEntity] = useState(true);
    const [readOnly, setReadOnly] = useState(false);
    const [isModified, setIsModified] = useState(false);
    const {code} = useParams();
    const history = useHistory();
    const abortController = useRef(null);
    const commentsComponent = useRef(null);
    const validators = useRef({})

    // Init dispatchers
    const dispatch = useDispatch();
    const setLayoutPropertyConst = (...args) => dispatch(setLayoutProperty(...args));
    const showNotificationConst = (...args) => dispatch(showNotification(...args));
    const showErrorConst = (...args) => dispatch(showError(...args));
    const showWarningConst = (...args) => dispatch(showWarning(...args));
    const handleErrorConst = (...args) => dispatch(handleError(...args));
    const toggleHiddenRegionConst = (...args) => dispatch(toggleHiddenRegion(...args));
    const setRegionVisibilityConst = (...args) => dispatch(setRegionVisibility(...args));

    // Fetch data from the redux store
    const screenCode = useSelector(state => state.application.userData[screenProperty]);
    const screenLayout = useSelector(state => state.application[layoutProperty]);
    const screenPermissions = useSelector(state => state.application.userData.screens[screenCode]);
    const userData = useSelector(state =>  state.application.userData);
    const applicationData = useSelector(state =>  state.application.applicationData);
    const showEqpTree = useSelector(state =>  state.ui.layout.showEqpTree);

    // HIDDEN REGIONS
    const isHiddenRegionConst = useSelector(state => isHiddenRegion(state)(screenCode))
    const getHiddenRegionStateConst = useSelector(state => getHiddenRegionState(state)(screenCode))
    const getUniqueRegionIDConst =  useSelector(state => getUniqueRegionID(state)(screenCode))

    useEffect( () => {
        code ? readEntity(code) : initNewEntity();
        // Reset window title when unmounting 
        return () => document.title = "EAM Light";
    }, [code])


    //
    // CRUD
    //
    const createEntity = () => {
        if (!validate()) {
            return;
        }

        setLoading(true); 

        WS.create(entity)
            .then(response => {
                const entityCode = response.body.data;
                showNotificationConst(entityDesc + ' ' + entityCode + ' has been successfully created.');
                // Read after the creation
                history.push(process.env.PUBLIC_URL + entityURL + encodeURIComponent(entityCode));
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorConst(error)
            })
            .finally( () => setLoading(false))
    }

    const readEntity = (code) => {
        setLoading(true); setErrors(null); 
        
        // Cancel the old request in the case it was still active
        abortController.current?.abort();
        abortController.current = new AbortController();
        //
        WS.read(code, { signal: abortController.current.signal })
            .then(response => {
                validators.current = {}; setIsModified(false); setNewEntity(false); 
                
                const readEntity = response.body.data;
                setEntity(readEntity);
                
                document.title = entityDesc + ' ' + readEntity[entityCodeProperty];
                
                // Render as read-only depending on screen rights, department security or custom handler
                setReadOnly(!screenPermissions.updateAllowed || 
                            isDepartmentReadOnly(readEntity.departmentCode, userData) || 
                            isReadOnlyCustomHandler?.(readEntity))

                // Invoke entity specific logic 
                postActions.read(readEntity)
            })
            .catch(error => {
                if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
                    handleErrorConst(error)
                }
            })
            .finally( () => setLoading(false))
    }

    const updateEntity = () => {
        if (!validate()) {
            return;
        }

        setLoading(true); 

        WS.update(entity)
            .then(response => {
                validators.current = {}; setIsModified(false); setErrors(null); 

                showNotificationConst(`${entityDesc} ${entity[entityCodeProperty]} has been successfully updated.`);
                readEntity(code);
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorConst(error)
            })
            .finally( () => setLoading(false))
    }

    const deleteEntity = () => {        
        setLoading(true); 
        
        WS.delete(code)
            .then(response => {
                showNotificationConst(`${entityDesc} ${entity[entityCodeProperty]} has been successfully deleted.`);
                history.push(process.env.PUBLIC_URL + entityURL);
            })
            .catch(error => {
                setErrors(error?.response?.body?.errors);
                handleErrorConst(error)
            })
            .finally( () => setLoading(false))
    }

    const initNewEntity = () => {
        setLoading(true); 
        
        WS.new()
            .then(response => {
                validators.current = {};
                setErrors(null);
                setNewEntity(true);
                setIsModified(false);
                setReadOnly(!screenPermissions.creationAllowed); 

                let newEntity = response.body.data;
                newEntity = assignDefaultValues(newEntity, screenLayout, layoutPropertiesMap);
                newEntity = assignQueryParamValues(newEntity);
                setEntity(newEntity);
                fireHandlers(newEntity, getHandlers());
                document.title = 'New ' + entityDesc;
                postActions.new(newEntity);
            })
            .catch(error => {
                handleErrorConst(error)
            })
            .finally( () => setLoading(false))
    }

    const copyEntity = () => {
        let code = entity[entityCodeProperty];
        
        validators.current = {};
        setErrors(null);
        setNewEntity(true);
        setIsModified(false);
        setReadOnly(!screenPermissions.creationAllowed); 

        setEntity( oldEntity => ({
            ...assignDefaultValues(oldEntity,
                screenLayout,
                layoutPropertiesMap),
            copyFrom: code
        }))
        window.history.pushState({}, '', process.env.PUBLIC_URL + entityURL);
        document.title = 'New ' + entityDesc;
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
                validators.current = {};
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
        // 
        if (!key.endsWith("Desc")) {
            setIsModified(true);
        }
    };

    const register = (layoutKey, valueKey, descKey, orgKey, onChange) => {
        let data = processElementInfo(screenLayout.fields[layoutKey] ?? getElementInfoForCustomField(layoutKey, entity.customField))
        
        data.onChange = createOnChangeHandler(valueKey, descKey, orgKey, updateEntityProperty, onChange);

        data.disabled = data.disabled || readOnly; // It should remain disabled 
        data.elementInfo = screenLayout.fields[layoutKey]; // Return elementInfo as it is still needed in some cases (for example for UDFs)
        
        // Value
        data.value = get(entity, valueKey);
        
        // Description 
        if (descKey) {
            data.desc = get(entity, descKey);
        }
        
        // Errors
        let error = errors?.find?.(e => e.location === data.id || e.location === valueKey);
        if (error) {
            data.errorText = error.message;
        }
        
        // Validators 
        // TODO: array of possible validators for each element and add validation for date(time)
        if (data.required) {
            validators.current[valueKey] = value => value ? '' : `${data.label} field cannot be blank.`;
        }
        if (data.type === 'number') {
            validators.current[valueKey] = value => !isNaN(value ?? 0) ? '' : `${data.label} must be a valid number.`;
        }

        return data;
    }

    const validate = () => {
        let errors = Object.entries(validators.current ?? {})
                           .map(([valueKey, validator]) => ({location: valueKey, message: validator(get(entity, valueKey))}))
                           .filter(e => e.message)
        setErrors(errors);
        return errors?.length === 0;
    };

    const getHandlers = () => ({...handlers, "classCode": onChangeClass});
    
    //
    //
    //
    return {screenCode, screenLayout, screenPermissions, 
        entity, newEntity, setEntity, loading, readOnly, isModified,
        userData, applicationData, 
        isHiddenRegion: isHiddenRegionConst, 
        getHiddenRegionState: getHiddenRegionStateConst, 
        getUniqueRegionID: getUniqueRegionIDConst, 
        commentsComponent,
        setLayoutProperty: setLayoutPropertyConst,
        showEqpTree, 
        // Dispatchers
        showError: showErrorConst, showNotification: showNotificationConst, handleError: handleErrorConst, showWarning: showWarningConst,
        toggleHiddenRegion: toggleHiddenRegionConst, setRegionVisibility: setRegionVisibilityConst,
        // 
        newHandler, saveHandler, deleteHandler, copyHandler, updateEntityProperty, register};

}

export default useEntity;