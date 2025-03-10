import React, { useState } from "react";
import WS from "../../../../tools/WS";
import EAMAutocomplete from "eam-components/dist/ui/components/inputs-ng/EAMAutocomplete";
import EAMSelect from "eam-components/dist/ui/components/inputs-ng/EAMSelect";
import Button from "@mui/material/Button";
import Refresh from "@mui/icons-material/Refresh";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import standard from "./modes/mode_standard.svg";
import swapping from "./modes/mode_swapping.svg";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  createOnChangeHandler,
  processElementInfo,
} from "eam-components/dist/ui/components/inputs-ng/tools/input-tools";
import Panel from "@/ui/components/panel/Panel";
import WSEquipment from "../../../../tools/WSEquipment";

const buttonStyle = {
  bottom: "-10px",
  left: "0px",
};

const MODE_STANDARD = "Standard";
const MODE_SWAPPING = "Swapping";

const ReplaceEqpGeneral = (props) => {
  const {
    equipmentLayout,
    onChangeNewEquipment,
    onChangeOldEquipment,
    replaceEquipmentHandler,
    replaceEquipment,
    stateList,
    statusList,
    showError,
    updateProperty,
    setBlocking,
    handleError,
  } = props;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detachableEquipment, setDetachableEquipment] = useState({});

  const idPrefix = "EAMID_ReplaceEqpGeneral_";

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const openDialog = () => {
    //Validate fields
    if (!validateFields()) {
      showError("Please fill the required fields");
      return;
    }

    //They cannot be the same equipment
    if (replaceEquipment.oldEquipment === replaceEquipment.newEquipment) {
      showError("New Equipment cannot be the same Old Equipment");
      return;
    }

    // Fetch equipment that will potentially get detached from parents
    if (replaceEquipment.replacementMode === MODE_STANDARD) {
      setBlocking(true);
      setDetachableEquipment({});

      WSEquipment.collectDetachableEquipment(replaceEquipment.oldEquipment)
        .then((response) => {
          setDetachableEquipment(response.body.data);
          setDialogOpen(true);
        })
        .catch((error) => handleError(error))
        .finally(() => setBlocking(false));
    } else {
      setDialogOpen(true);
    }
  };

  const executeReplace = () => {
    replaceEquipmentHandler();
    setDialogOpen(false);
  };

  const validateFields = () => {
    const {
      oldEquipment,
      oldEquipmentStatus,
      oldEquipmentState,
      newEquipment,
    } = replaceEquipment;
    return (
      oldEquipment && oldEquipmentStatus && oldEquipmentState && newEquipment
    );
  };

  const renderImageMode = () => {
    const imageStandard = {
      backgroundImage: `url('${standard}')`,
    };

    const imageSwapping = {
      backgroundImage: `url('${swapping}')`,
    };

    return (
      <div>
        <h4 style={{ marginBottom: "5px" }}>Replacement Mode</h4>
        <RadioGroup
          aria-label="replacementMode"
          name="replacementMode"
          value={replaceEquipment.replacementMode}
          onChange={(event) =>
            updateProperty("replacementMode", event.target.value)
          }
          style={{ flexDirection: "row" }}
        >
          <FormControlLabel
            key={MODE_STANDARD}
            value={MODE_STANDARD}
            control={<Radio color="primary" />}
            label={`Standard`}
            style={imageStandard}
            className={`imageRadio ${
              replaceEquipment.replacementMode === MODE_STANDARD
                ? "optionSelected"
                : ""
            }`}
          />

          <FormControlLabel
            key={MODE_SWAPPING}
            value={MODE_SWAPPING}
            control={<Radio color="primary" />}
            label={`Swapping`}
            style={imageSwapping}
            className={`imageRadio ${
              replaceEquipment.replacementMode === MODE_SWAPPING
                ? "optionSelected"
                : ""
            }`}
          />
        </RadioGroup>
      </div>
    );
  };

  const detachableEquipmentEntries = Object.entries(detachableEquipment);

  return (
    <Panel heading="REPLACE EQUIPMENT" alwaysExpanded={true}>
      <div style={{ width: "100%", marginTop: 0 }}>
        <EAMAutocomplete
          {...processElementInfo(equipmentLayout.fields["equipmentno"])}
          required
          label={"Old Equipment"}
          id={`${idPrefix}OLDEQUIPMENT`}
          value={replaceEquipment.oldEquipment}
          desc={replaceEquipment.oldEquipmentDesc}
          autocompleteHandler={WS.autocompleteEquipment}
          autocompleteHandlerParams={[true]}
          onChange={createOnChangeHandler(
            "oldEquipment",
            "oldEquipmentDesc",
            null,
            updateProperty,
            onChangeOldEquipment
          )}
          barcodeScanner
        />

        <EAMSelect
          {...processElementInfo(equipmentLayout.fields["assetstatus"])}
          required
          label={"Old Equipment Status after replacement"}
          disabled={statusList.length === 0}
          options={statusList}
          value={replaceEquipment.oldEquipmentStatus}
          onChange={createOnChangeHandler(
            "oldEquipmentStatus",
            null,
            null,
            updateProperty
          )}
        />

        <EAMSelect
          required
          label={"Old Equipment State after replacement"}
          disabled={!stateList || stateList.length === 0}
          options={stateList}
          value={replaceEquipment.oldEquipmentState}
          onChange={createOnChangeHandler(
            "oldEquipmentState",
            null,
            null,
            updateProperty
          )}
        />

        <EAMAutocomplete
          {...processElementInfo(equipmentLayout.fields["equipmentno"])}
          required
          label={"New Equipment"}
          id={`${idPrefix}NEWEQUIPMENT`}
          value={replaceEquipment.newEquipment}
          desc={replaceEquipment.newEquipmentDesc}
          autocompleteHandler={WS.autocompleteEquipment}
          autocompleteHandlerParams={[true]}
          onChange={createOnChangeHandler(
            "newEquipment",
            "newEquipmentDesc",
            null,
            updateProperty,
            onChangeNewEquipment
          )}
          barcodeScanner
        />

        {renderImageMode()}

        <Button onClick={openDialog} color="primary" style={buttonStyle}>
          <Refresh />
          Replace Equipment
        </Button>

        <Dialog open={dialogOpen} onClose={closeDialog}>
          <DialogTitle id="alert-dialog-title">{`Replace Equipment`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to replace {replaceEquipment.oldEquipment}{" "}
              with {replaceEquipment.newEquipment}?
              {replaceEquipment.replacementMode === MODE_STANDARD &&
                detachableEquipmentEntries.length > 0 &&
                " The following equipment will be detached: "}
              {detachableEquipmentEntries.map(([child, parent], index) => (
                <li key={index}>
                  '{child}' from '{parent}'
                </li>
              ))}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={executeReplace} color="primary" autoFocus>
              Replace Equipment
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Panel>
  );
};

export default ReplaceEqpGeneral;
