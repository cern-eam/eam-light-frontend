import { useState, useEffect, useRef, useMemo, createElement } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import ErrorTypes from "eam-components/dist/enums/ErrorTypes";
import queryString from "query-string";
import set from "set-value";
import {
  assignCustomFieldFromCustomField,
  isDepartmentReadOnly,
  isMultiOrg,
  getElementInfoFromCustomFields,
  prepareDataForFieldsValidator,
} from "@/ui/pages/EntityTools";
import {
  createOnChangeHandler,
  processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import useFieldsValidator from "eam-components/dist/ui/components/inputs-ng/hooks/useFieldsValidator";
import useLayoutStore from "../state/useLayoutStore";
import useUserDataStore from "../state/useUserDataStore";
import useApplicationDataStore from "../state/useApplicationDataStore";
import {
  useHiddenRegionsStore,
  getUniqueRegionID,
} from "../state/useHiddenRegionsStore";
import { TABS } from "../ui/components/entityregions/TabCodeMapping";
import useEquipmentTreeStore from "../state/useEquipmentTreeStore";
import useSnackbarStore from "../state/useSnackbarStore";
import { getCustomFields } from "../tools/WSCustomFields";
import { assignDefaultValues, toEAMValue, createAutocompleteHandler, fromEAMValue, getCodeOrg } from "./tools";
import { applyTimezoneOffsetToYearField } from "../ui/pages/EntityTools";

const useEntity = (params) => {
  const {
    WS,
    postActions,
    handlers,
    entityCode,
    entityDesc,
    entityURL,
    entityCodeProperty,
    entityOrgProperty,
    entityProperty,
    screenProperty,
    resultDataCodeProperty,
    resultDefaultDataProperty,
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
  const [id, setId] = useState(null)
  const [extraData, setExtraData] = useState({});
  const { code: codeFromRoute } = useParams();
  const codeQueryParam = queryString.parse(window.location.search)[
    codeQueryParamName
  ]; //TODO add equipment and part identifiers
  const history = useHistory();
  const abortController = useRef(null);
  const commentsComponent = useRef(null);

  const pendingMultiKeyHandlersRef = useRef({});

  const { showNotification, showError, showWarning, handleError } =
    useSnackbarStore();
  const { userData } = useUserDataStore();
  const { applicationData } = useApplicationDataStore();
  const { isHiddenRegion, setRegionVisibility } = useHiddenRegionsStore();
  const {
    equipmentTreeData: { showEqpTree },
    updateEquipmentTreeData,
  } = useEquipmentTreeStore();

  const screenCode = userData[screenProperty];
  const {
    screenLayout: { [screenCode]: screenLayout },
    fetchScreenLayout,
  } = useLayoutStore();
  const screenPermissions = userData.screens[screenCode];



  const {
    errorMessages,
    validateFields,
    generateErrorMessagesFromException,
    resetErrorMessages,
  } = useFieldsValidator(screenLayout?.fields, entity)
  //   //useMemo( // TODO!!!
  //   () =>
  //     prepareDataForFieldsValidator(entity, screenLayout, layoutPropertiesMap),
  //   [screenCode, entity?.customField],
  //   //),
  //   entity
  // );


  const userCode = useMemo(() => userData.eamAccount.userCode, [userData]);

  useEffect(() => {
    if (!screenLayout) {
      fetchScreenLayout(
        userData.eamAccount.userGroup,
        userData.screens[screenCode].entity,
        userData.screens[screenCode].parentScreen,
        screenCode,
        TABS[userData.screens[screenCode].parentScreen]
      );
    }
  }, [screenCode]);

  useEffect(() => {
    if (!screenLayout) {
      return;
    }

    if (!codeFromRoute && codeQueryParam) {
      history.push(
        process.env.PUBLIC_URL +
          entityURL +
          codeQueryParam +
          window.location.search
      );
      return;
    }
    codeFromRoute ? readEntity() : initNewEntity();
    // Reset window title when unmounting
    return () => (document.title = "EAM Light");
  }, [codeFromRoute, screenLayout]);

  // Provide mount and unmount handlers to the client
  useEffect(() => {
    onMountHandler?.();
    return () => onUnmountHandler?.();
  }, []);

  //
  // CRUD
  //
  const createEntity = (entityToCreate = entity) => {
    // if (!validateFields()) {
    //   return;
    // }

    setLoading(true);

    WS.create(entityToCreate)
      .then((response) => {
        const entityCode = get(response.body.Result.ResultData, resultDataCodeProperty);
        showNotification(response.body.Result.InfoAlert.Message);
        commentsComponent.current?.createCommentForNewEntity(entityCode);
        // Read after the creation (and append the organization in multi-org mode)
        history.push(process.env.PUBLIC_URL +  entityURL + encodeURIComponent(entityCode + "#" +  get(entityToCreate, entityOrgProperty)));
      })
      .catch((error) => {
        //TODO generateErrorMessagesFromException(error?.response?.body?.errors);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const readEntity = () => {
    setLoading(true);
    const {code, org} = getCodeOrg(codeFromRoute)
    // Cancel the old request in the case it was still active
    abortController.current?.abort();
    abortController.current = new AbortController();
    //
    WS.read(code, org, { signal: abortController.current.signal })
      .then((response) => {
        resetErrorMessages();
        setIsModified(false);
        setNewEntity(false);
        const readEntity = response.body.Result.ResultData[entityProperty]
        // Sort custom based on the index prop
        readEntity.USERDEFINEDAREA?.CUSTOMFIELD?.sort((cf1, cf2) => (cf1.index ?? 0) - (cf2.index ?? 0))

        // Temporary fix (SG-15959)
        //applyTimezoneOffsetToYearField(readEntity)

        setEntity(readEntity);
        setId({code: get(readEntity, entityCodeProperty), org: get(readEntity, entityOrgProperty)})

        document.title = entityDesc + " " + get(readEntity, entityCodeProperty);
        //Render as read-only depending on screen rights, department security or custom handler
        setReadOnly(
          !screenPermissions.updateAllowed ||
            isDepartmentReadOnly(readEntity.DEPARTMENTID.DEPARTMENTCODE, userData) ||
            isReadOnlyCustomHandler?.(readEntity)
        );
        // Invoke entity specific logic
        postActions?.read(readEntity);
      })
      .catch((error) => {
        console.error('readEntity error', error)
        if (error.type !== ErrorTypes.REQUEST_CANCELLED) {
          handleError(error);
        }
      })
      .finally(() => setLoading(false));
  };

  const updateEntity = () => {
    // if (!validateFields()) {
    //   return;
    // }

    setLoading(true);

    WS.update(entity)
      .then((response) => {
        resetErrorMessages();
        setIsModified(false);

        commentsComponent.current?.createCommentForNewEntity(entityCode);
        showNotification(response.body.Result.InfoAlert.Message);
        readEntity();
      })
      .catch((error) => {
        console.error('updateEntity error', error)
        //TODO: generateErrorMessagesFromException(error?.response?.body?.ErrorAlert[0].Message);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const deleteEntity = () => {
    setLoading(true);

    WS.delete(get(entity,entityCodeProperty), get(entity,entityOrgProperty))
      .then((response) => {
        showNotification(response.body.Result.InfoAlert.Message);
        history.push(process.env.PUBLIC_URL + entityURL);
      })
      .catch((error) => {
        //TODO: generateErrorMessagesFromException(error?.response?.body?.errors);
        handleError(error);
      })
      .finally(() => setLoading(false));
  };

  const initNewEntity = () => {
    setLoading(true);

    Promise.all([
      WS.new(),
      getCustomFields(entityCode, "*")
    ])
      .then(([response, customFields]) => {
        resetErrorMessages();
        setNewEntity(true);
        setIsModified(false);
        setReadOnly(!screenPermissions.creationAllowed);
        setId(null)

        let newEntity = response.body.Result.ResultData[resultDefaultDataProperty ?? entityProperty] ?? response.body.Result.ResultData
        newEntity.USERDEFINEDAREA = customFields.body.Result;
        newEntity = assignDefaultValues(newEntity, screenLayout);

        // Temporary fix (SG-15959)
        //applyTimezoneOffsetToYearField(newEntity)

        setEntity(newEntity)

        assignQueryParamValues()
        document.title = "New " + entityDesc;
        postActions?.new(newEntity);
      })
      .catch((error) => {
        console.error('initNewEntity error', error)
        handleError('init error', error);
      })
      .finally(() => setLoading(false));
  };

  const copyEntity = () => {
    let code = entity[entityCodeProperty];

    resetErrorMessages();
    setNewEntity(true);
    setIsModified(false);
    setReadOnly(!screenPermissions.creationAllowed);
    setId(null)

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
     getCustomFields(entityCode, newClass)
     .then((response) => {
        setEntity((prevEntity) => assignCustomFieldFromCustomField(prevEntity, response.body.Result.CUSTOMFIELD));
      })
     .catch(console.error);
  };

  const updateEntityProperty = (key, value, type) => {
    setEntity((prevEntity) => set({ ...prevEntity }, key, toEAMValue(value, type)));
    fireHandler(key, value);
  };

const fireHandler = (key, value) => {
  const handlers = getHandlers();
  const pending = pendingMultiKeyHandlersRef.current;

  for (const [keys, handler] of Object.entries(handlers)) {
    const [k1, k2] = keys.split(",");

    if (!k2 && k1 === key) {
      handler(value);
      continue;
    }

    if (key === k1) {
      (pending[keys] ??= {})[k1] = value;
    } else if (key === k2) {
      if ((pending[keys] ?? {})[k1] !== undefined) {
        pending[keys][k2] = value;
        handler(pending[keys]);
        pending[keys] = {};
      }
    }
  }
};



  const assignQueryParamValues = () => {
      let queryParams = queryString.parse(window.location.search);
      Object.entries(queryParams).forEach(([key, value]) => {
        // Support wshub key values for backwards compatibility in addition to EAM element IDs
        const altKey = Object.keys(layoutPropertiesMap ?? {}).find(k => layoutPropertiesMap?.[k].alias?.toLowerCase() === key.toLowerCase());
        const elementInfo = screenLayout.fields[key] ?? screenLayout.fields[altKey]
        if (elementInfo && elementInfo.xpath && value) {
          updateEntityProperty(elementInfo.xpath, getCodeOrg(value).code, elementInfo.fieldType)

          // Check if organization shouold be assigned too
          const elementCustomInfo = layoutPropertiesMap[key] ?? layoutPropertiesMap[altKey]
          if (elementCustomInfo.org) {
            updateEntityProperty(elementCustomInfo.org, getCodeOrg(value).org)
          }

        }
      })
      // TODO custom fields
  };

  const register = (layoutKey, valueKey, descKey, orgKey, onChange) => {

    const elementInfo = screenLayout.fields[layoutKey]
    const elementCustomInfo = layoutPropertiesMap[layoutKey];

    if (elementCustomInfo) {
      if (!valueKey) {
        valueKey = elementCustomInfo.value;
      }

      if (!descKey) {
        descKey = elementCustomInfo.desc;
      }

      if (!orgKey) {
        orgKey = elementCustomInfo.org;
      }
    }

    if (!valueKey) {
      valueKey = elementInfo.xpath
    }

    let data = processElementInfo(elementInfo ?? getElementInfoFromCustomFields(layoutKey, entity.USERDEFINEDAREA.CUSTOMFIELD))

    data.onChange = createOnChangeHandler(
      valueKey,
      descKey,
      orgKey,
      (key, value) => updateEntityProperty(key, value, data.type),
      onChange ?? elementCustomInfo?.onChange
    );

    if (elementCustomInfo?.clear) {
      data.onClear = () => updateEntityProperty(elementCustomInfo.clear, null)
    }

    data.disabled = data.disabled || readOnly; // It should remain disabled
    data.elementInfo = elementInfo; // Return elementInfo as it is still needed in some cases (for example for UDFs)

    // Value
    data.value = fromEAMValue(get(entity, valueKey), data.type)

    // Description
    if (descKey) {
      data.desc = get(entity, descKey);
    }

    // Link
    if (elementCustomInfo?.link) {
      const orgLink = get(entity, orgKey) ? "%23" + get(entity, orgKey) : "";
      data.link = () => (data.value ? elementCustomInfo.link + data.value + orgLink : null)
    }


    Object.assign(data, createAutocompleteHandler(elementInfo, screenLayout.fields, entity, 
      {...elementCustomInfo?.autocompleteHandlerData, userFunctionName: screenCode, extraData}))

    // Errors
    data.errorText = errorMessages[layoutKey];

    return data;
  };

  const getHandlers = () => ({ ...handlers, "CLASSID.CLASSCODE": onChangeClass });

  const updateExtraData = (key, value) => setExtraData(prev => ({ ...prev, [key]: value }));

  const clearExtraData = () => setExtraData({});
  //
  //
  //
  return {
    screenCode,
    screenLayout,
    screenPermissions,
    entity,
    id,
    newEntity,
    setEntity,
    updateExtraData,
    clearExtraData,
    loading,
    readOnly,
    isModified,
    userData,
    applicationData,
    setRegionVisibility,
    isHiddenRegion: isHiddenRegion(screenCode, userCode),
    getUniqueRegionID: getUniqueRegionID(screenCode, userCode),
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
    createEntity,
  };
};

export default useEntity;
