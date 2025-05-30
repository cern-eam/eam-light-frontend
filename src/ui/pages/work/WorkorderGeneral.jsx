import * as React from "react";
import EAMCheckbox from "eam-components/dist/ui/components/inputs-ng/EAMCheckbox";
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
import EAMInput from "../../components/EAMInput";

function WorkorderGeneral(props) {
  const {
    workorder,
    register,
    applicationData,
    statuses,
    userGroup,
    userData,
    screenPermissions,
    newEntity,
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
      {isMultiOrg && newEntity && (<EAMSelect {...register("organization")} />)}

      <EAMInput {...register("description")} />

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

      <EAMTextField {...register("udfchar01")} />

      <EAMTextField {...register("udfchar20")} />

      <EAMTextField {...register("udfchar24")}  />

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
