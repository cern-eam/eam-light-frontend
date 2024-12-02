import { useState, useEffect, useRef, useMemo, createElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import {
  assignDefaultValues,
  assignQueryParamValues,
  assignCustomFieldFromCustomField,
  assignCustomFieldFromObject,
  AssignmentType,
  fireHandlers,
  isDepartmentReadOnly,
  isMultiOrg,
  getElementInfoFromCustomFields,
  prepareDataForFieldsValidator,
} from "@/ui/pages/EntityTools";
import WSCustomFields from "eam-components/dist/tools/WSCustomFields";
import WSS from "../tools/WS"
import {
  createOnChangeHandler,
  processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import useFieldsValidator from "eam-components/dist/ui/components/inputs-ng/hooks/useFieldsValidator";
import useLayoutStore from "../state/useLayoutStore";
import useUserDataStore from "../state/useUserDataStore";
import useApplicationDataStore from "../state/useApplicationDataStore";
import { useHiddenRegionsStore, getUniqueRegionID } from "../state/useHiddenRegionsStore";
import { TABS } from "../ui/components/entityregions/TabCodeMapping";
import useEquipmentTreeStore from "../state/useEquipmentTreeStore";
import useSnackbarStore from "../state/useSnackbarStore";

const useEntity = (params) => {
  const {
    WS,
    postActions,
    handlers,
    entityCode,
    entityDesc,
    entityURL,
    entityCodeProperty,
    screenProperty,
    layoutProperty,
    layoutPropertiesMap,
    isReadOnlyCustomHandler,
    onMountHandler,
    onUnmountHandler,
    codeQueryParamName,
  } = params;

  const [loading, setLoading] = useState(false);
  const [entity, setEntity] = useState(null);
  const [newEntity, setNewEntity] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const { code } = useParams();
  const codeQueryParam = queryString.parse(window.location.search)[
    codeQueryParamName
    ]; //TODO add equipment and part identifiers
  const history = useHistory();
  const abortController = useRef(null);
  const commentsComponent = useRef(null);

  const { showNotification, showError, showWarning, handleError } = useSnackbarStore();
  const { userData } = useUserDataStore();
  const { applicationData } = useApplicationDataStore();
  const { isHiddenRegion, setRegionVisibility } = useHiddenRegionsStore();
  const {equipmentTreeData: {showEqpTree}, updateEquipmentTreeData} = useEquipmentTreeStore();

  const screenCode = userData[screenProperty];
  const {screenLayout: {[screenCode]: screenLayout}, fetchScreenLayout} = useLayoutStore();
  const screenPermissions = userData.screens[screenCode];

  const {
    errorMessages,
    validateFields,
    generateErrorMessagesFromException,
    resetErrorMessages,
  } = useFieldsValidator(
    //useMemo(
    () =>
      prepareDataForFieldsValidator(
        entity,
        screenLayout,
        layoutPropertiesMap
      ),
    [screenCode, entity?.customField]
    //),
    ,
    entity
  );

  useEffect(() => {
    if (!screenLayout) {
      fetchScreenLayout(userData.eamAccount.userGroup,
        userData.screens[screenCode].entity,
        userData.screens[screenCode].parentScreen,
        screenCode,
        TABS[userData.screens[screenCode].parentScreen]);
    }
  }, [screenCode])

  useEffect(() => {
    if (!screenLayout) {
      return;
    }

    if (!code && codeQueryParam) {
      history.push(
        process.env.PUBLIC_URL +
        entityURL +
        codeQueryParam +
        window.location.search
      );
      return;
    }
    code ? readEntity(code) : initNewEntity();
    // Reset window title when unmounting
    return () => (document.title = "EAM Light");
  }, [code, screenLayout]);

  // Provide mount and unmount handlers to the client 
  useEffect(() => {
    onMountHandler?.();
    return () => onUnmountHandler?.();
  }, []);

  //
  // CRUD
  //
  const createEntity = (entityToCreate = entity) => {
    if (!validateFields()) {
      return;
    }
    setLoading(true);

    WS.create(entityToCreate)
      .then((response) => {
        const entityCode = response.body.data;
        showNotification(
          entityDesc + " " + entityCode + " has been successfully created."
        );
        commentsComponent.current?.createCommentForNewEntity(entityCode);
        // Read after the creation (and append the organization in multi-org mode)
        history.push(
          process.env.PUBLIC_URL +
          entityURL +
          encodeURIComponent(
            entityCode +
            (isMultiOrg && entityToCreate.organization
              ? "#" + entityToCreate.organization
              : "")
          )
        );
      })
      .catch((error) => {
        generateErrorMessagesFromException(error?.response?.body?.errors);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const readEntity = (code) => {
    setLoading(true);

    // Cancel the old request in the case it was still active
    abortController.current?.abort();
    abortController.current = new AbortController();
    //
    WS.read(code, { signal: abortController.current.signal })
      .then((response) => {
        resetErrorMessages();
        setIsModified(false);
        setNewEntity(false);

        const readEntity = response.body.data;
        setEntity(readEntity);

        document.title = entityDesc + " " + readEntity[entityCodeProperty];

        // Render as read-only depending on screen rights, department security or custom handler
        setReadOnly(
          !screenPermissions.updateAllowed ||
          isDepartmentReadOnly(readEntity.departmentCode, userData) ||
          isReadOnlyCustomHandler?.(readEntity)
        );

        // Invoke entity specific logic
        postActions.read(readEntity);
      })
      .catch((error) => {
        if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
          handleError(error);
        }
      })
      .finally(() => setLoading(false));
  };

  const updateEntity = () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    WS.update(entity)
      .then((response) => {
        resetErrorMessages();
        setIsModified(false);

        commentsComponent.current?.createCommentForNewEntity(entityCode);
        showNotification(
          `${entityDesc} ${entity[entityCodeProperty]} has been successfully updated.`
        );
        readEntity(code);
      })
      .catch((error) => {
        generateErrorMessagesFromException(error?.response?.body?.errors);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const deleteEntity = () => {
    setLoading(true);

    WS.delete(code)
      .then((response) => {
        showNotification(
          `${entityDesc} ${entity[entityCodeProperty]} has been successfully deleted.`
        );
        history.push(process.env.PUBLIC_URL + entityURL);
      })
      .catch((error) => {
        generateErrorMessagesFromException(error?.response?.body?.errors);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const initNewEntity = () => {
    setLoading(true);

    WS.new()
      .then((response) => {
        resetErrorMessages();
        setNewEntity(true);
        setIsModified(false);
        setReadOnly(!screenPermissions.creationAllowed);

        let newEntity = response.body.data;
        newEntity = assignDefaultValues(
          newEntity,
          screenLayout,
          layoutPropertiesMap
        );
        newEntity = assignQueryParamValues(newEntity);
        setEntity(newEntity);
        fireHandlers(newEntity, getHandlers());
        document.title = "New " + entityDesc;
        postActions.new(newEntity);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const copyEntity = () => {
    let code = entity[entityCodeProperty];

    resetErrorMessages();
    setNewEntity(true);
    setIsModified(false);
    setReadOnly(!screenPermissions.creationAllowed);

    setEntity((oldEntity) => ({
      ...assignDefaultValues(oldEntity, screenLayout, layoutPropertiesMap),
      copyFrom: code,
    }));
    window.history.pushState({}, "", process.env.PUBLIC_URL + entityURL);
    document.title = "New " + entityDesc;
    postActions?.copy?.();
  };

  //
  // BUTTON HANDLERS
  //
  const saveHandler = () => (newEntity ? createEntity() : updateEntity());

  const newHandler = () => history.push(entityURL);

  const deleteHandler = () => deleteEntity();

  const copyHandler = () => copyEntity();

  //
  // HELPER METHODS
  //
  const onChangeClass = (newClass) => {
    return WSCustomFields.getCustomFields(entityCode, newClass)
      .then((response) => {
        setEntity((prevEntity) => {
          const newCustomFields = response.body.data;
          let entity = assignCustomFieldFromCustomField(
            prevEntity,
            newCustomFields,
            AssignmentType.SOURCE_NOT_EMPTY
          );

          // replace custom fields with ones in query parameters if we have just created the entity
          if (newEntity) {
            const queryParams = queryString.parse(window.location.search);
            entity = assignCustomFieldFromObject(
              entity,
              queryParams,
              AssignmentType.SOURCE_NOT_EMPTY
            );
          }
          return entity;
        });
      })
      .catch(console.error);
  };

  const updateEntityProperty = (key, value) => {
    setEntity((prevEntity) => set({ ...prevEntity }, key, value));
    // Fire handler for the 'key'
    getHandlers()[key]?.(value);
    //
    if (!key.endsWith("Desc")) {
      setIsModified(true);
    }
  };

  const register = (layoutKey, valueKey, descKey, orgKey, onChange) => {
    let data = processElementInfo(
      screenLayout.fields[layoutKey] ??
      getElementInfoFromCustomFields(layoutKey, entity.customField)
    );

    data.onChange = createOnChangeHandler(
      valueKey,
      descKey,
      orgKey,
      updateEntityProperty,
      onChange
    );

    data.disabled = data.disabled || readOnly; // It should remain disabled
    data.elementInfo = screenLayout.fields[layoutKey]; // Return elementInfo as it is still needed in some cases (for example for UDFs)

    // Value
    data.value = get(entity, valueKey);

    // Description
    if (descKey) {
      data.desc = get(entity, descKey);
    }

    // Errors
    data.errorText = errorMessages[valueKey];

    // Autocomplete handlers 
    if (data.elementInfo
      && data.elementInfo.onLookup
      && data.elementInfo.onLookup !== '{}' // TODO !== '{}'
    ) {
      try {
        const { lovName, inputVars, inputFields, returnFields } = JSON.parse(data.elementInfo.onLookup);
        const inputParams = {
          ...inputVars,
          ...Object.entries(inputFields ?? {})
            .map(([key, val]) => ({[key]: entity?.[layoutPropertiesMap[val]]}))
            .reduce((acc, el) => ({...acc, ...el}), {}),
          "param.pagemode": 'view',
          //...extraParams,
        }
        let genericLov = {
          inputParams,
          returnFields,
          lovName,
          exact: false,
          rentity: screenCode,
        };

        // hint might be of type signal (due to an autocomplete hook) which brakes the API, so for now make it a string if it's not
        data.autocompleteHandler = (hint, config) => WSS.getLov({ ...genericLov, hint: typeof hint === 'string' ? hint : "" }, config);
      } catch (err) {
        console.error(`Error when setting autocompleteHandler on ${layoutKey}`, err)
      }
    }

    return data;
  };

  const getHandlers = () => ({ ...handlers, classCode: onChangeClass });

  //
  //
  //
  return {
    screenCode,
    screenLayout,
    screenPermissions,
    entity,
    newEntity,
    setEntity,
    loading,
    readOnly,
    isModified,
    userData,
    applicationData,
    setRegionVisibility,
    isHiddenRegion: isHiddenRegion(screenCode),
    getUniqueRegionID: getUniqueRegionID(screenCode),
    commentsComponent,
    showEqpTree,
    updateEquipmentTreeData,
    // Dispatchers
    showError,
    showNotification,
    handleError,
    showWarning,
    //
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty,
    register,
    setNewEntity,
    setLoading,
    setReadOnly,
    createEntity
  };
};

export default useEntity;
