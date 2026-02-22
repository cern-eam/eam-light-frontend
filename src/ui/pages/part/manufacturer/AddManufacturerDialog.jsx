import React from "react";
import DialogContent from "@mui/material/DialogContent";
import ScreenContainers from "../../../layout/ScreenContainers";
import useEntity from "../../../../hooks/useEntity";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import BlockUi from "react-block-ui";
import { layoutPropertiesMap } from "./manufacturerTools";
import { createManufacturer } from "../../../../tools/WSParts";
import { getOrg } from "../../../../hooks/tools";

export default function AddManufacturerDialog({ open, onClose, updateEquipmentProperty, equipment }) {
  
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
        create: createManufacturer,
        new: () => Promise.resolve({body: {Result: {ResultData: {}}}}),
    },
    postActions: {
        new: postInit,
        create: postCreate,
    },
    screenProperty: "manufacturerScreen",
    entityDesc: 'Manufacturer',
    entityCode: "MANU",
    explicitIdentifier: ``,
    pageMode: false,
    layoutPropertiesMap: layoutPropertiesMap,
});

function postInit() {
  updateManufacturerProperty('MANUFACTURERID.ORGANIZATIONID.ORGANIZATIONCODE', getOrg());
}

function postCreate(manufacturer) {
  if (!equipment.ManufacturerInfo?.MANUFACTURERCODE) {
    updateEquipmentProperty('ManufacturerInfo.MANUFACTURERCODE', manufacturer.MANUFACTURERID.MANUFACTURERCODE);
  }
  onClose();
}

  return (
    <Dialog fullWidth 
      id="addManufacturerDialog" 
      open={open} onClose={onClose} 
      aria-labelledby="form-dialog-title"
      onMouseDown={(e) => e.stopPropagation()}
      >
      
      <DialogTitle id="form-dialog-title">Add Manufacturer</DialogTitle>
      
      <DialogContent id="content">
        <div>
          <BlockUi tag="div" blocking={loading}>
            <ScreenContainers
                register={register}
                screenLayout={manufacturerLayout}
                layoutPropertiesMap={layoutPropertiesMap}
                containers={['cont_1','cont_2','cont_3', 'cont_4', 'cont_5', 'cont_6']}
              />
          </BlockUi>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>Cancel</Button>
        <Button onClick={saveHandler} color="primary" disabled={loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
