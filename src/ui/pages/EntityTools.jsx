import set from "set-value";
import queryString from "query-string";
import formatfns from "date-fns/format";
import { Link } from "react-router-dom";
import { parseISO } from "date-fns";
import { processElementInfo } from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import { get } from "lodash";
import GridOnIcon from "@mui/icons-material/GridOn";
import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import BlockUi from "react-block-ui";
import { Launch, Web } from "@mui/icons-material";
import { equipmentLayoutPropertiesMap } from "./equipment/EquipmentTools";
import ResizableIFrame from "../components/iframes/ResizableIframe";
import CustomFieldTools from "../components/customfields/CustomFieldTools";
import { fromEAMValue } from "../../hooks/tools";

// clones an entity deeply
export const cloneEntity = (entity) => ({
  ...entity,
  userDefinedFields: {
    ...(entity.userDefinedFields || {}),
  },
  customField: [...(entity.customField || []).map((cf) => ({ ...cf }))],
});

// There are 3 kinds of entity assignments:
// 1. always copy from source to destination (FORCED)
//      - used when you wish to force an assignment
// 2. copy from source to destination if source is not empty (SOURCE_NOT_EMPTY)
//      - used when you wish to assign only if you have something to assign
//        (trying to assign an empty value to an existing one will not change it)
// 3. copy from source to destination if destination is empty (DESTINATION_EMPTY)
//      - used when you wish to assign only if what you are assigning to is empty
//        (trying to assign an existing value to another existing value will not change it)
export const AssignmentType = {
  FORCED: {
    sourceNotEmpty: false,
    destinationEmpty: false,
  },
  SOURCE_NOT_EMPTY: {
    sourceNotEmpty: true,
    destinationEmpty: false,
  },
  DESTINATION_EMPTY: {
    sourceNotEmpty: false,
    destinationEmpty: true,
  },
  // Note: there is no combination where both sourceNotEmpty and destinationEmpty are true
  // because this is effectively the same as DESTINATION_EMPTY, as if the source is empty,
  // it will not change an empty destination anyway
};

const throwIfInvalidAssignmentType = (assignmentType) => {
  if (!Object.values(AssignmentType).includes(assignmentType)) {
    throw new Error("You must specify a valid assigment type");
  }
};

// assigns the user defined fields from userDefinedFields to the entity
export const assignUserDefinedFields = (
  entity,
  userDefinedFields = {},
  assignmentType
) => {
  throwIfInvalidAssignmentType(assignmentType);
  const { sourceNotEmpty, destinationEmpty } = assignmentType;

  const newEntity = cloneEntity(entity);
  let expr = Object.entries(userDefinedFields);

  if (sourceNotEmpty) {
    expr = expr.filter(([, value]) => value);
  }

  if (destinationEmpty) {
    expr = expr.filter(([key]) => !newEntity.userDefinedFields[key]);
  }

  expr.forEach(([key, value]) => (newEntity.userDefinedFields[key] = value));
  return newEntity;
};


// assigns the custom fields from the customField object to the entity, merging old values
export const assignCustomFieldFromCustomField = (
  entity,
  newCustomFields
) => {
  const currentCustomFields = entity?.USERDEFINEDAREA?.CUSTOMFIELD || [];
  const mergedAndSortedFields = (newCustomFields ?? [])
    .map(field => {
      const matchingField = currentCustomFields.find(
        existing => existing.PROPERTYCODE === field.PROPERTYCODE
      );
      return matchingField ?? field;
    })
    .sort((cf1, cf2) => (cf1.index ?? 0) - (cf2.index ?? 0));

  return {
    ...entity,
    USERDEFINEDAREA: {
      ...entity.USERDEFINEDAREA,
      CUSTOMFIELD: mergedAndSortedFields
    }
  };
};

// assigns the values in values to the entity
// values that do not exist in the entity are not copied
// if the entity has a non-empty value, that value is not copied, unless forced is truthy
export const assignValues = (entity, values = {}, assignmentType) => {
  throwIfInvalidAssignmentType(assignmentType);
  const { sourceNotEmpty, destinationEmpty } = assignmentType;

  const newEntity = cloneEntity(entity);
  let expr = Object.keys(newEntity).filter((key) => values.hasOwnProperty(key));

  if (destinationEmpty) {
    expr = expr.filter((key) => !newEntity[key]);
  }

  if (sourceNotEmpty) {
    expr = expr.filter((key) => values[key]);
  }

  expr.forEach((key) => (newEntity[key] = values[key]));
  return newEntity;
};


// this function converts an object with case insensitive keys to an object with
// case sensitive keys, based on a target object
export const toSensitive = (target, insensitive) => {
  const mapping = Object.fromEntries(
    Object.entries(target).map(([k]) => [k.toLowerCase(), k])
  );

  return Object.fromEntries(
    Object.entries(insensitive)
      .map(([key, value]) => [mapping[key.toLowerCase()], value])
      .filter(([key]) => key !== undefined)
  );
};

export const getTabAvailability = (tabs, tabCode) => {
  if (!tabs[tabCode]) return true;
  return tabs[tabCode].tabAvailable;
};

export const getTabInitialVisibility = (tabs, tabCode) => {
  if (!tabs[tabCode]) return true;
  return tabs[tabCode].alwaysDisplayed;
};

export const isDepartmentReadOnly = (departmentCode, userData) => {
  return userData.eamAccount.departmentalSecurity[departmentCode]?.readOnly;
};

export const formatDate = (date) => format(date, "dd-MMM-yyyy");

export const formatDateTime = (date) => format(date, "dd-MMM-yyyy HH:mm");

const format = (date, dateFormat) => {
  try {
    return formatfns(parseISO(date), dateFormat);
  } catch (error) {
    console.error("formatDate error" + error);
  }

  return null;
};

export const getElementInfoFromCustomFields = (layoutKey, customFields) => {
  let customField = customFields.find((cf) => cf.PROPERTYCODE === layoutKey);

  return getElementInfoForCustomField(customField);
};

export const getElementInfoForCustomField = (customField) => {
  const mapper = {
    NUM:  "number",
    DATE: "date",
    DATI: "datetime"
  }

  return {
    text: CustomFieldTools.isCategoryValue(customField) ? customField?.PROPERTYLABEL + " (cat. value)" : customField?.PROPERTYLABEL,
    xpath: "EAMID_" + customField?.PROPERTYCODE,
    fieldType: mapper[customField?.type] ?? "text"
  };
};

export const registerCustomField =
  (entity) => (layoutKey, valueKey, descKey) => {
    let data = processElementInfo(
      getElementInfoFromCustomFields(layoutKey, entity.USERDEFINEDAREA.CUSTOMFIELD)
    );
    
    data.value = fromEAMValue(get(entity, valueKey), data.type);
    if (descKey) {
      data.desc = get(entity, descKey);
    }
    data.disabled = true;
    return data;
  };

export const prepareDataForFieldsValidator = (
  entity,
  screenLayout,
  layoutPropertiesMap
) => {
  if (!entity) {
    return {};
  }

  const temp = Object.entries(layoutPropertiesMap).reduce(
    (acc, [layoutKey, fieldKey]) => {
      acc[fieldKey] = screenLayout.fields[layoutKey];
      return acc;
    },
    {}
  );

  entity.customField.reduce((acc, customField, index) => {
    acc[`customField.${index}.value`] =
      getElementInfoForCustomField(customField);
    return acc;
  }, temp);

  return temp;
};

export const isMultiOrg = import.meta.env.VITE_MULTI_ORG === "TRUE";

export const getCustomTabGridRenderers = (applicationData) => {
  return {
    caseno: (value) => (
      <a href={applicationData.EL_LOURL + value} target="_blank">
        {value}
      </a>
    ),
    equipmentno: (value) => (
      <Link to={{ pathname: `/equipment/${value}` }} target="_blank">
        {value}
      </Link>
    ),
    workorderno: (value) => (
      <Link to={{ pathname: `/workorder/${value}` }} target="_blank">
        {value}
      </Link>
    ),
    partno: (value) => (
      <Link to={{ pathname: `/part/${value}` }} target="_blank">
        {value}
      </Link>
    ),
  };
};

export const renderLoading = (message) => {

  const blockUiStyle = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  
  const blockUiStyleDiv = {
    display: "flex",
    height: 60,
    alignItems: "flex-end"
  };

  return (
    <BlockUi tag="div" blocking={true} style={blockUiStyle}>
      <div style={{blockUiStyleDiv}}>{message}</div>
    </BlockUi>
  )
  
}

export const getTabGridRegions = (
  applicationData,
  customGridTabs,
  paramNames,
  screenCode,
  objectCode
) => {
  const customTabGridRenderers = getCustomTabGridRenderers(applicationData);
  return Object.entries(customGridTabs).map(([tabId, tab], index) => {
    return {
      id: tab.tabDescription.replaceAll(" ", "").toUpperCase(),
      label: tab.tabDescription,
      isVisibleWhenNewEntity: true,
      maximizable: true,
      render: ({ isMaximized }) => (
        <EAMGridTab
          screenCode={screenCode}
          tabName={tabId}
          objectCode={objectCode}
          paramNames={paramNames}
          customRenderers={customTabGridRenderers}
          showGrid={isMaximized}
          rowCount={100}
          gridContainerStyle={
            isMaximized
              ? {
                  height: `${
                    document.getElementById("entityContent").offsetHeight - 220
                  }px`,
                }
              : {}
          }
        ></EAMGridTab>
      ),
      column: 2,
      order: 30 + 5 * index,
      summaryIcon: GridOnIcon,
      ignore: !tab.tabAvailable,
      initialVisibility: tab.alwaysDisplayed,
    };
  });
};

const getCustomTabUrl = (customTab, tabId, screenCode, equipment, userData, layoutPropertiesMap) => {
  const { value, urlParams = [] } = customTab;
  const systemParams = {
    "CURRENT_TAB_NAME": tabId,
    "SYSTEM_FUNCTION_NAME": screenCode
  }
  const params = urlParams
  .reduce((acc, { paramName, paramValue, system, useFieldValue }) => {
    if (paramName) {
      const systemValue = systemParams[paramName];
      if (systemValue) {
        acc[paramName] = systemValue;
      } else {
        acc[paramName] = (system || useFieldValue) ? equipment[layoutPropertiesMap[paramName] || ''] : paramValue;
      }
    }
    return acc;
  }, {});

  return `${value.replace(":user", userData.eamAccount?.userCode)}${value.includes('?') ? '&' : '?'}${queryString.stringify(params)}`;
}

export const getCustomTabRegions = (
  customTabs,
  screenCode,
  equipment,
  userData,
  layoutPropertiesMap = equipmentLayoutPropertiesMap
) => Object.entries(customTabs).map(([tabId, tab], index) => {
    const url = getCustomTabUrl(tab, tabId, screenCode, equipment, userData, layoutPropertiesMap);
    return {
      id: tabId,
      label: tab.tabDescription,
      isVisibleWhenNewEntity: true,
      maximizable: true,
      render: ({isMaximized}) => (
        <ResizableIFrame
          style={{
            width: "100%",
            height: isMaximized
              ? `${document.getElementById("entityContent").offsetHeight - 220}px`
              : "400px",
            minWidth: "100%",
            border: "none"
          }}
          iframeResizerOptions={{
            scrolling: false,
            checkOrigin: false,
          }}
          src={url}
        />
      ),
      column: 1,
      order: 40 + 5 * index,
      summaryIcon: Web,
      ignore: !tab.tabAvailable,
      initialVisibility: tab.alwaysDisplayed,
      RegionPanelProps: {
        detailsStyle: { padding: 0 },
        customHeadingBar: 
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginLeft: "4px"
            }}
          >
            <Link to={{ pathname: url }} target="_blank">
              <Launch fontSize="small" />
            </Link>
          </div>
      }
    };
  });


  export const toEAMNumber = (input) => {
    const num = Number(input);
  
    if (isNaN(num) || !num) {
      return null
      // return {
      //   VALUE: null,
      //   NUMOFDEC: 0,
      //   SIGN: "+",
      //   UOM: "default",
      //   qualifier: "OTHER"
      // };
    }
  
    const numOfDec = num.toString().includes('.')
      ? num.toString().split('.')[1].length
      : 0;
  
    const value = Math.round(Math.abs(num) * Math.pow(10, numOfDec));
  
    return {
      VALUE: value,
      NUMOFDEC: numOfDec,
      SIGN: num >= 0 ? "+" : "-",
      UOM: "default",
      qualifier: "OTHER"
    };
  }
  
  export const fromEAMNumber = (input) => {
    if (!input || input.VALUE == null || isNaN(input.VALUE)) {
      return null;
    }
  
    const raw = input.VALUE / Math.pow(10, input.NUMOFDEC || 0);
    const number = input.SIGN === '-' ? -raw : raw;
  
    return number.toString();
  };

  const pad = (num) => String(num).padStart(2, '0');

  export const fromEAMDate = (data) => {
    if (!data?.YEAR) return null;
  
    const {
      YEAR, MONTH = 1, DAY = 1,
      HOUR = 0, MINUTE = 0, SECOND = 0,
      TIMEZONE = 'Z',
    } = data;
  
    // Use TIMEZONE only to determine correct year
    const offsetMinutes = TIMEZONE === 'Z'
      ? 0
      : (parseInt(TIMEZONE.slice(1, 3)) * 60 + parseInt(TIMEZONE.slice(3))) * (TIMEZONE[0] === '-' ? -1 : 1);
  
    const adjusted = new Date(YEAR + offsetMinutes * 60000);
    const year = adjusted.getUTCFullYear();
  
    // Build local ISO string (without milliseconds)
    const localISO = `${year}-${pad(MONTH)}-${pad(DAY)}T${pad(HOUR)}:${pad(MINUTE)}:${pad(SECOND)}`;
  
    // Parse as local time, convert to UTC
    return new Date(localISO).toISOString();
  };


  export const toEAMDate = (iso) => {
    
    if (!iso) return null;
  
    const local = new Date(iso);
    const yearEpoch = new Date(`${local.getFullYear()}-01-02T00:00:00`).getTime();
  
    let eamDate = {
      YEAR: yearEpoch,
      MONTH: local.getMonth() + 1,
      DAY: local.getDate(),
      HOUR: local.getHours(),
      MINUTE: local.getMinutes(),
      SECOND: local.getSeconds(),
      SUBSECOND: local.getMilliseconds(),
      TIMEZONE: '+0000',
      qualifier: 'OTHER'
    };

    console.log('to', iso, eamDate)

    return eamDate

  };
  
  
  
  