import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import { PartsAssociatedDialog } from "./PartsAssociatedDialog";
import WSEquipment from "../../../tools/WSEquipment";
import useSnackbarStore from '@/state/useSnackbarStore';
import EISTable from 'eam-components/dist/ui/components/table';

const PartsAssociatedContainer = (
    { code, associationEntity, disabled }
  ) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const initState = {
    part: null,
    quantity: 1,
  };
  const {showError, showNotification} = useSnackbarStore();
  const [isLoading, setLoading] = useState(false);
  const [partAssociated, setPartAssociated] = useState(initState);
  const headers = ['Part', 'Description', 'Quantity', 'UOM'];
  const propCodes = ['papartcode', 'description', 'quantity', 'partuom'];
  const [data, setData] = useState([]);

  useEffect(() => {
    if (code) {
      fetchData(code, associationEntity);
    }
  }, [code]);

  const fetchData = (code, associationEntity) => {
      setLoading(true)
          WSEquipment.getEquipmentPartsAssociated(code, associationEntity).then((response) => {
              setData(response.body.data);
              setLoading(false);
          }).catch((error) => {
              console.log(error);
              setLoading(false);
          });
  };

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
      equipmentCode: code,
      partCode: value.part,
      associationEntity
    }
    
    setLoading(true);
    WSEquipment.createPartAssociated(newAssociation).then((result)=> {
      if(result.body && result.body.data) {
        setIsDialogOpen(false);
        setPartAssociated(initState);
        showNotification(`${value.part} has been associated to ${code} `)
        fetchData(code, associationEntity)
      } else {
        showError(`The association has failed`)
      }
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
      showError(e?.response?.body?.errors?.[0]?.message || "The association has failed");
    })
  }

  if (!data) {
    return React.Fragment
  }

  return (
    <div>   
      {data?.length > 0 &&
        <EISTable
            data={data}
            headers={headers}
            propCodes={propCodes} />
        }
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
  );
}

export { PartsAssociatedContainer };