import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import { PartsAssociatedDialog } from "./PartsAssociatedDialog";
import WSEquipment from "../../../tools/WSEquipment";
import useSnackbarStore from '@/state/useSnackbarStore';
import EISTable from 'eam-components/dist/ui/components/table';
import { getPartsAssociatedByParent } from '../../../tools/WSParts';

const PartsAssociatedContainer = (
    { code, associationEntity = 'OBJ', disabled, hideAddPartAssociation = false }
  ) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const initState = {
    part: null,
    quantity: null,
  };
  const {showError, showNotification} = useSnackbarStore();
  const [isLoading, setLoading] = useState(false);
  const [partAssociated, setPartAssociated] = useState(initState);
  const headers = ['Part', 'Description', 'Quantity', 'UOM'];
  const propCodes = ['partcode', 'description', 'quantity', 'partuom'];
  const [data, setData] = useState([]);

  useEffect(() => {
    if (code) {
      fetchData(code);
    }
  }, [code]);

 const fetchData = (code) => {
  setLoading(true);

  getPartsAssociatedByParent(code)
    .then((response) => {
      const records = response.body.Result.ResultData.DATARECORD || [];
      if(records.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }
      const formattedData = records.map(part => ({
        partcode: part.PARTID?.PARTCODE || "",
        description: part.PARTID?.DESCRIPTION || "",
        quantity: part.PARTQUANTITY?.VALUE || 0,
        partuom: part.UOMCODE || part.partUoM || ""
      }));

      setData(formattedData);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
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
      showError(e?.response?.body?.errors?.[0]?.message ?? "The association has failed");
    })
  }

  if (!data) {
    return React.Fragment
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {data?.length > 0 &&
        <EISTable
            data={data}
            headers={headers}
            propCodes={propCodes} />
        }
      {!hideAddPartAssociation &&
        <div style={{ marginTop: '16px' }}>
            <Button onClick={() => setIsDialogOpen(true)} color="primary"
                    disabled={disabled} variant="outlined">
                Add Parts Association
            </Button>
          </div>
        }
       
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