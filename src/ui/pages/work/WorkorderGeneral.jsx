import * as React from "react";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
import WS from "../../../tools/WS";
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import { isDepartmentReadOnly, isMultiOrg } from "../EntityTools";
import EAMUDF from "@/ui/components/userdefinedfields/EAMUDF";
import { IconButton } from "@mui/material";
import { FileTree } from "mdi-material-ui";
import useEquipmentTreeStore from "../../../state/useEquipmentTreeStore";

function WorkorderGeneral(props) {
  const {
    workorder,
    register,
    applicationData,
    statuses,
    userGroup,
    equipment,
    userData,
    screenPermissions,
    newEntity,
    screenCode,
  } = props;
  const rpawClassesList =
    (applicationData &&
      applicationData.EL_TRPAC &&
      applicationData.EL_TRPAC.split(",")) ||
    [];
  const rpawLink = applicationData && applicationData.EL_TRPAW;

  

  const treeButtonClickHandler = (code) => {
    useEquipmentTreeStore.getState().updateEquipmentTreeData({
      showEqpTree: true,
      equipment: {
        code: workorder.equipmentCode,
        organization: workorder.equipmentOrganization
      }
    });
  };

  return (
    <React.Fragment>
      {isMultiOrg && newEntity && (
        <EAMSelect
          {...register("organization", "organization")}
          autocompleteHandler={WS.getOrganizations}
          autocompleteHandlerParams={[screenCode]}
        />
      )}

      <EAMTextField {...register("description", "description")} />

      <EAMAutocomplete
        {...register(
          "equipment",
          "equipmentCode",
          "equipmentDesc",
          "equipmentOrganization"
        )}
        barcodeScanner
        autocompleteHandler={WS.autocompleteEquipment}
        autocompleteHandlerParams={[false]}
        link={() =>
          workorder.equipmentCode
            ? "/equipment/" + workorder.equipmentCode
            : null
        }
        endAdornment={
          <IconButton
            size="small"
            onClick={treeButtonClickHandler}
            disabled={!workorder.equipmentCode}
          >
            <FileTree />
          </IconButton>
        }
      />

      <EAMAutocomplete
        {...register("location", "locationCode", "locationDesc")}
        autocompleteHandler={WS.autocompleteLocation}
      />

      <EAMAutocomplete
        {...register("department", "departmentCode", "departmentDesc")}
        autocompleteHandler={WS.autocompleteDepartment}
        validate
      />

      <EAMSelect
        {...register("workordertype", "typeCode", "typeDesc")}
        renderSuggestion={(suggestion) => suggestion.desc}
        renderValue={(value) => value.desc || value.code}
        autocompleteHandler={WSWorkorders.getWorkOrderTypeValues}
        autocompleteHandlerParams={[userGroup]}
      />

      <EAMSelect
        {...register("workorderstatus", "statusCode", "statusDesc")}
        disabled={
          isDepartmentReadOnly(workorder.departmentCode, userData) ||
          !screenPermissions.updateAllowed ||
          !workorder.jtAuthCanUpdate
        }
        renderSuggestion={(suggestion) => suggestion.desc}
        renderValue={(value) => value.desc || value.code}
        options={statuses}
      />

      <EAMSelect
        {...register("priority", "priorityCode", "priorityDesc")}
        autocompleteHandler={WSWorkorders.getWorkOrderPriorities}
      />

      <EAMAutocomplete
        {...register("woclass", "classCode", "classDesc")}
        autocompleteHandler={WS.autocompleteClass}
        autocompleteHandlerParams={["EVNT"]}
      />

      <EAMAutocomplete
        {...register("standardwo", "standardWO", "standardWODesc")}
        autocompleteHandler={WSWorkorders.autocompleteStandardWorkOrder}
        autocompleteHandlerParams={[
          userGroup,
          equipment?.classCode,
          equipment?.categoryCode,
        ]}
      />

      <EAMAutocomplete
        {...register("costcode", "costCode", "costCodeDesc")}
        autocompleteHandler={WSWorkorders.autocompleteCostCode}
      />

      <EAMTextField {...register("targetvalue", "targetValue")} />

      <EAMTextField
        {...register("parentwo", "parentWO")}
        link={() =>
          workorder.parentWO && rpawClassesList.includes(workorder.classCode)
            ? rpawLink + workorder.parentWO
            : null
        }
      />

      <EAMTextField
        {...register(
          "udfchar01",
          "userDefinedFields.udfchar01",
          "userDefinedFields.udfchar01Desc"
        )}
        link={() =>
          workorder.userDefinedFields?.udfchar01
            ? "https://cern.service-now.com/task.do?sysparm_query=number=" +
              workorder.userDefinedFields.udfchar01
            : null
        }
      />

      <EAMTextField
        {...register(
          "udfchar20",
          "userDefinedFields.udfchar20",
          "userDefinedFields.udfchar20Desc"
        )}
      />

      <EAMTextField
        {...register(
          "udfchar24",
          "userDefinedFields.udfchar24",
          "userDefinedFields.udfchar24Desc"
        )}
        link={() =>
          workorder.userDefinedFields?.udfchar24
            ? "https://its.cern.ch/jira/browse/" +
              workorder.userDefinedFields.udfchar24
            : null
        }
      />

      <EAMUDF {...register("udfchkbox01", `userDefinedFields.udfchkbox01`)} />

      <EAMUDF {...register("udfchkbox02", `userDefinedFields.udfchkbox02`)} />

      <EAMUDF {...register("udfchkbox03", `userDefinedFields.udfchkbox03`)} />

      <EAMUDF {...register("udfchkbox04", `userDefinedFields.udfchkbox04`)} />

      <EAMUDF {...register("udfchkbox05", `userDefinedFields.udfchkbox05`)} />

      <EAMCheckbox {...register("warranty", "warranty")} />

      <EAMTextField {...register("downtimehours", "downtimeHours")} />
    </React.Fragment>
  );
}

export default WorkorderGeneral;
