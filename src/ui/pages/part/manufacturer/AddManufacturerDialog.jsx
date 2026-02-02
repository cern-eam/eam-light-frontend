import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import ScreenContainers from "../../../layout/ScreenContainers";
import useEntity from "../../../../hooks/useEntity";
import { Button, DialogActions, DialogTitle } from "@mui/material";
import BlockUi from "react-block-ui";
import { layoutPropertiesMap } from "./manufacturerTools";

export default function AddManufacturerDialog({ open, onClose }) {
  
  if (!open) {
    return null;
  }

  const {
    saveHandler,
    updateEntityProperty: updateManufacturerProperty,
    register,
    loading,
    screenLayout: manufacturerLayout,
    newEntity,
} = useEntity({
    WS: {
        create: () => {},
        new: () => {},
    },
    postActions: {
        new: postInit,
        create: postCreate,
    },
    screenProperty: "manufacturerScreen",
    entityDesc: 'Manufacturer',
    explicitIdentifier: ``,
    updateWindowTitle: false,
    layoutPropertiesMap: layoutPropertiesMap,
});

function postInit() {
  
}

function postCreate() {
  onClose();
}

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <DialogTitle id="form-dialog-title">Add Manufacturer</DialogTitle>
      <DialogContent>
        <BlockUi tag="div" blocking={loading}>
          <ScreenContainers
              register={register}
              screenLayout={manufacturerLayout}
              layoutPropertiesMap={layoutPropertiesMap}
              ctx={{ newEntity }}
              containers={['cont_1', 'cont_2', 'cont_3']}
            />
        </BlockUi>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>Cancel</Button>
        <Button onClick={saveHandler} color="primary" disabled={loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
