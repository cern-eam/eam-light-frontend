import EAMGridTab from "eam-components/dist/ui/components/grids/eam/EAMGridTab";
import React, { useRef, useState } from 'react';
import { Button } from "@mui/material";
import { PartsAssociatedDialog } from "./PartsAssociatedDialog";
import WSEquipment from "../../../tools/WSEquipment";
import useSnackbarStore from '@/state/useSnackbarStore';

const PartsAssociatedContainer = (
    { objCode, objOrganization, isMaximized, disabled, hideAddPartAssociation }
  ) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const initState = {
    part: null,
    quantity: 1,
  };
  const {showError, showNotification} = useSnackbarStore();
  const [isLoading, setLoading] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [partAssociated, setPartAssociated] = useState(initState);

  const updatePartAssociatedProperty = (key, value) => {
      setPartAssociated((prevPart) => ({
          ...prevPart,
          [key]: value,
      }));
  };

  const handleSave = (value) => {
    if (typeof +value.quantity !== 'number') {
      showError(`Quantity is invalid`);
      return;
    }

    const newAssociation = {
      quantity: value.quantity,
      equipmentCode: objCode,
      partCode: value.part,
    }
    setLoading(true);
    WSEquipment.createPartAssociated(newAssociation).then((result)=> {
      if(result.body && result.body.data) {
        setIsDialogOpen(false);
        setPartAssociated(initState);
        showNotification(`${value.part} has been associated to ${objCode} `)
        setShowGrid(false);
        setTimeout(() => setShowGrid(true), 50) //to force re-render
      } else {
        showError(`The association has failed`)
      }
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
      showError(e?.response?.body?.errors?.[0]?.message || "The association has failed");
    })
  }

  return (
    <>
      {showGrid && (
        <EAMGridTab
          gridName="BSPARA"
          objectCode={`${objCode}#${objOrganization}`}
          paramNames={["param.valuecode"]}
          additionalParams={{ "param.entity": "OBJ" }}
          showGrid={isMaximized}
          rowCount={100}
          gridContainerStyle={
            isMaximized
              ? {
                  height: `${
                    document.getElementById("entityContent")?.offsetHeight - 220
                  }px`,
                }
              : {}
          }
        />
      )}
      {!hideAddPartAssociation && ( <div>
        <div style={{ marginTop: '16px' }}>
          <Button onClick={() => setIsDialogOpen(true)} color="primary"
                  disabled={disabled} variant="outlined">
              Add Parts Association
          </Button>
        </div>
        <PartsAssociatedDialog
          isDialogOpen={isDialogOpen}
          handleCancel={()=>setIsDialogOpen(false)}
          handleSave={handleSave}
          partAssociated={partAssociated}
          isLoading={isLoading}
          updatePartAssociatedProperty={updatePartAssociatedProperty}/>
      </div>
    )}
    </>
  );

}

export { PartsAssociatedContainer };

