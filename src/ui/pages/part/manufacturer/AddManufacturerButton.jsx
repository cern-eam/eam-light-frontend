import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import AddManufacturerDialog from "./AddManufacturerDialog";

export default function AddManufacturerButton({updateEquipmentProperty, equipment}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} size="small" aria-label="add manufacturer">
        <AddIcon />
      </IconButton>
      <div>
        <AddManufacturerDialog open={open} onClose={() => setOpen(false)} updateEquipmentProperty={updateEquipmentProperty} equipment={equipment} />
      </div>
    </>
  );
}
