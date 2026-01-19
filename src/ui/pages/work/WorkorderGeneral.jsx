import * as React from "react";
import WSWorkorders from "../../../tools/WSWorkorders";
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import WSWorkorder from "../../../tools/WSWorkorders";
import { isDepartmentReadOnly, isMultiOrg } from "../EntityTools";
import { IconButton } from "@mui/material";
import { FileTree } from "mdi-material-ui";
import useEquipmentTreeStore from "../../../state/useEquipmentTreeStore";
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

      <EAMComboAutocomplete
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

      <EAMComboAutocomplete {...register("location")} />

      <EAMComboAutocomplete {...register("department")} />

      <EAMSelect
        {...register("workordertype")}
        renderSuggestion={(suggestion) => suggestion.desc}
        renderValue={(value) => value.desc || value.code}
        autocompleteHandler={WSWorkorders.getWorkOrderTypeValues}
        autocompleteHandlerParams={[userGroup]}
      />

      <EAMComboAutocomplete
        {...register("workorderstatus")}
        disabled={
          isDepartmentReadOnly(workorder.DEPARTMENTID?.DEPARTMENTCODE, userData) ||
          !screenPermissions.updateAllowed ||
          workorder?.STATUS?.STATUSCODE === 'A'
          //!workorder.jtAuthCanUpdate
        }
        //renderSuggestion={(suggestion) => suggestion.desc}
        //renderValue={(value) => value.desc || value.code}
        //options={statuses}
        autocompleteHandler={WSWorkorder.getWorkOrderStatusValues}
        autocompleteHandlerParams={[workorder.STATUS.STATUSCODE, newEntity]}
        optionsTransformer={options => options.map(o => ({ code: o.code, desc: o.desc?.replace(`${o.code} - `, "") }))}
      />

      <EAMComboAutocomplete {...register("priority")} />

      <EAMComboAutocomplete {...register("woclass")} />

      <EAMComboAutocomplete {...register("standardwo")} />

      <EAMComboAutocomplete {...register("costcode")}  />

      <EAMTextField {...register("targetvalue")} />

      <EAMTextField
        {...register("parentwo")}
        link={() =>
          workorder.parentWO && rpawClassesList.includes(workorder.classCode)
            ? rpawLink + workorder.parentWO
            : null
        }
      />

      <EAMInput {...register("udfchar01")} />

      <EAMInput {...register("udfchar20")} />

      <EAMInput {...register("udfchar24")}  />

      <EAMInput {...register("udfchkbox01")} />

      <EAMInput {...register("udfchkbox02")} />

      <EAMInput {...register("udfchkbox03")} />

      <EAMInput {...register("udfchkbox04")} />

      <EAMInput {...register("udfchkbox05")} />

      <EAMInput {...register("warranty")} />

      <EAMInput {...register("downtimehours")} />
    </React.Fragment>
  );
}

export default WorkorderGeneral;
