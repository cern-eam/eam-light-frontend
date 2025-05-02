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
import { autocompleteDepartment } from "../../../tools/WSGrids";

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
        code: workorder.EQUIPMENTID?.EQUIPMENTCODE,
        organization: workorder.EQUIPMENTID?.ORGANIZATIONID.ORGNIZATIONCODE
      }
    });
  };

  return (
    <React.Fragment>
      {isMultiOrg && newEntity && (
        <EAMSelect
          {...register("organization")}
          autocompleteHandler={WS.getOrganizations}
          autocompleteHandlerParams={[screenCode]}
        />
      )}

      <EAMTextField {...register("description")} />

      <EAMAutocomplete
        {...register("equipment")}
        barcodeScanner
        endAdornment={
          <IconButton
            size="small"
            onClick={treeButtonClickHandler}
            disabled={!workorder.EQUIPMENTID?.EQUIPMENTCODE}
          >
            <FileTree />
          </IconButton>
        }
      />

      <EAMAutocomplete {...register("location")}/>

      <EAMAutocomplete
        {...register("department")}
        autocompleteHandler={autocompleteDepartment}
        autocompleteHandlerParams={['*']}
      />

      <EAMSelect
        {...register("workordertype")}
        renderSuggestion={(suggestion) => suggestion.desc}
        renderValue={(value) => value.desc || value.code}
        autocompleteHandler={WSWorkorders.getWorkOrderTypeValues}
        autocompleteHandlerParams={[userGroup]}
      />

      <EAMSelect
        {...register("workorderstatus")}
        disabled={
          isDepartmentReadOnly(workorder.DEPARTMENTID?.DEPARTMENTCODE, userData) ||
          !screenPermissions.updateAllowed 
          //!workorder.jtAuthCanUpdate
        }
        renderSuggestion={(suggestion) => suggestion.desc}
        renderValue={(value) => value.desc || value.code}
        options={statuses}
      />

      <EAMSelect {...register("priority")} autocompleteHandler={WSWorkorders.getWorkOrderPriorities}/>

      <EAMAutocomplete {...register("woclass")} />

      <EAMAutocomplete {...register("standardwo")} />

      <EAMAutocomplete {...register("costcode")}  />

      <EAMTextField {...register("targetvalue")} />

      <EAMTextField
        {...register("parentwo")}
        link={() =>
          workorder.parentWO && rpawClassesList.includes(workorder.classCode)
            ? rpawLink + workorder.parentWO
            : null
        }
      />

      <EAMTextField
        {...register("udfchar01")}
        link={() =>
          workorder.userDefinedFields?.udfchar01
            ? "https://cern.service-now.com/task.do?sysparm_query=number=" +
              workorder.userDefinedFields.udfchar01
            : null
        }
      />

      <EAMTextField
        {...register("udfchar20")}
      />

      <EAMTextField
        {...register("udfchar24")}
        link={() =>
          workorder.userDefinedFields?.udfchar24
            ? "https://its.cern.ch/jira/browse/" +
              workorder.userDefinedFields.udfchar24
            : null
        }
      />

      <EAMUDF {...register("udfchkbox01")} />

      <EAMUDF {...register("udfchkbox02")} />

      <EAMUDF {...register("udfchkbox03")} />

      <EAMUDF {...register("udfchkbox04")} />

      <EAMUDF {...register("udfchkbox05")} />

      <EAMCheckbox {...register("warranty")} />

      <EAMTextField {...register("downtimehours")} />
    </React.Fragment>
  );
}

export default WorkorderGeneral;
