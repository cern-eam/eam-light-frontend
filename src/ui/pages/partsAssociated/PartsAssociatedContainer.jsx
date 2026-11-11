import React, { useEffect, useState } from 'react';
import { Button } from "@mui/material";
import { PartsAssociatedDialog } from "./PartsAssociatedDialog";
import WSEquipment from "../../../tools/WSEquipment";
import useSnackbarStore from '@/state/useSnackbarStore';
import EISTable from 'eam-components/dist/ui/components/table';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { getPartsAssociatedByParent } from '../../../tools/WSParts';
import Entities from "@/enums/Entities";

const PartsAssociatedContainer = (
    { code, isMaximized = false, associationEntity = "OBJ", disabled, hideAddPartAssociation = false, parentEntity = Entities.ASSET }
  ) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const initState = {
    part: null,
    quantity: null,
  };
  const {showError, showNotification} = useSnackbarStore();
  const [isLoading, setLoading] = useState(false);
  const [partAssociated, setPartAssociated] = useState(initState);
      const isKnownEntity = Object.values(Entities).includes(parentEntity);
    const useEquipmentEndpoint = !isKnownEntity;
  const headers = ['Part', 'Description', 'Quantity', 'UOM', 'Delete'];
  const propCodes = ['partcode', 'description', 'quantity', 'partuom', 'delete'];
  const [data, setData] = useState([]);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    if (code) {
      fetchData(code, parentEntity, associationEntity);
    }
  }, [code, parentEntity, associationEntity]);

  const fetchData = (code, parentEntity, associationEntity) => {
    setLoading(true);


    const renderDelete = (row) => (
      <IconButton size="small" color="error" onClick={() => setRowToDelete(row)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    );

    const request = useEquipmentEndpoint
      ? WSEquipment.getEquipmentPartsAssociated(code, associationEntity)
      : getPartsAssociatedByParent(code, { parentEntity });
    request
      .then((response) => {
        let formattedData;

        if (useEquipmentEndpoint) {
          const rows = response.body?.data || [];
          formattedData = rows.map((row) => ({
            ...row,
            partcode: row?.papartcode,
            delete: renderDelete(row),
          }));
        } else {
          const records = response.body?.Result?.ResultData?.DATARECORD || [];
          formattedData = records.map((part) => ({
            partcode: part.PARTID?.PARTCODE || "",
            description: part.PARTID?.DESCRIPTION || "",
            quantity: part.PARTQUANTITY?.VALUE || 0,
            partuom: part.UOMCODE || part.partUoM || "",
            delete: renderDelete(part),
          }));
        }
        setData(formattedData);
      })
      .catch((error) => {
        console.error(error);
        setData([]);
      })
      .finally(() => setLoading(false));
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
        fetchData(code, parentEntity, associationEntity)
      } else {
        showError(`The association has failed`)
      }
      setLoading(false);
    }).catch((e) => {
      setLoading(false);
      showError(e?.response?.body?.errors?.[0]?.message ?? "The association has failed");
    })
  }

  const handleDelete = (value) => {
    if (!value) return;
    setLoading(true);
    WSEquipment.deletePartAssociated(value.PARTASSOCIATEDCODE ?? value.valuecode, value.PARTASSOCIATEDID?.PARTASSOCIATEDPK ?? value.partassociatedpk).then(()=> {
      fetchData(code, parentEntity, associationEntity)
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
        <ConfirmationDialog
          open={rowToDelete !== null}
          onClose={() => setRowToDelete(null)}
          onConfirm={() => handleDelete(rowToDelete)}
          title="Delete parts association?"
          content={
            rowToDelete
              ? `Are you sure you would like to delete the association with part ${rowToDelete.papartcode}?`
              : "Are you sure you would like to delete this parts association?"
          }
          confirmButtonText="Delete"
        />
      </div>
  );
}

export { PartsAssociatedContainer };