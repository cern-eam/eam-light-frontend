import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import EAMTextField from "eam-components/dist/ui/components/inputs-ng/EAMTextField";
import WSEquipment from "../../../tools/WSEquipment";
import { processElementInfo } from 'eam-components/dist/ui/components/inputs-ng/tools/input-tools';
import PropTypes from "prop-types";
import useUserDataStore from '../../../state/useUserDataStore';
import useLayoutStore from '../../../state/useLayoutStore';
import EAMComboAutocomplete from 'eam-components/dist/ui/components/inputs-ng/EAMComboAutocomplete';


const PartsAssociatedDialog = ({
  isDialogOpen,
  handleCancel,
  handleSave,
  partAssociated,
  isLoading,
  updatePartAssociatedProperty}) => {

    if (!isDialogOpen) {
      return null;
    }
    
    const { userData } = useUserDataStore();
    const [ uom, setUom ] = useState("  ")

    const {
        screenLayout: { BSPARA: partsAssociatedLayout },
        fetchScreenLayout,
    } = useLayoutStore();

    useEffect(() => {
        if (!partsAssociatedLayout) {
            fetchScreenLayout(userData.eamAccount.userGroup, "EMPTY", "BSPARA", "BSPARA", []);
        }
    }, [partsAssociatedLayout]);


  PartsAssociatedDialog.propTypes = {
    isDialogOpen: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    handleCancel: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    partAssociated: PropTypes.shape({
      part: PropTypes.string,
      quantity: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ])
    }).isRequired,
    updatePartAssociatedProperty: PropTypes.func.isRequired,
  };

  const onPartSelect = (part) => {
    if (part && part?.uom) {
      updatePartAssociatedProperty("part", part.code)
      setUom(part.uom)
    } else {
      updatePartAssociatedProperty("part", "")
      setUom("  ")
    }
  }

  const onQuantityChange = (quantity) => {
    updatePartAssociatedProperty("quantity", quantity)
  }

  if (!partsAssociatedLayout) {
    return React.Fragment
  }

  return (
    <Dialog
        fullWidth
        id="addPartsAssociatedDialog"
        open={isDialogOpen}
        onClose={handleCancel}
        aria-labelledby="form-dialog-title">

        <DialogTitle id="form-dialog-title">Add Associated Part</DialogTitle>

        <DialogContent id="content" style={{ overflowY: 'visible' }}>
        
        <EAMComboAutocomplete
            {...processElementInfo(partsAssociatedLayout.fields.papartcode)}
            label="Part"
            value={partAssociated["part"]}
            onChange={onPartSelect}
            autocompleteHandler={WSEquipment.autocompletePartsAssociated}
            />
        <EAMTextField
            {...processElementInfo(partsAssociatedLayout.fields.quantity)}
            label="Quantity"
            valueKey="quantity"
            value={partAssociated["quantity"]}
            onChangeInput={onQuantityChange}
            endTextAdornment={uom}
            renderDependencies={uom}
        />

        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel} disabled={isLoading} color="primary">
                Cancel
            </Button>
            <Button disabled={!(partAssociated.part && partAssociated.quantity) || isLoading} onClick={() => handleSave(partAssociated)} color="primary">
                Save
            </Button>
        </DialogActions>
    </Dialog>
  );
}

export { PartsAssociatedDialog };