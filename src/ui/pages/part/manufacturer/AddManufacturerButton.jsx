import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import AddManufacturerDialog from "./AddManufacturerDialog";
import useUserDataStore from "../../../../state/useUserDataStore";
import useApplicationDataStore from "../../../../state/useApplicationDataStore";

export default function AddManufacturerButton({updateEquipmentProperty, equipment}) {
  const [open, setOpen] = useState(false);

  // TEMP don't render if environment is production (12.2@CERN)
  const { applicationData } = useApplicationDataStore();
  if (applicationData?.EL_ENVIR === "PROD") {
    return null;
  }

  const { userData } = useUserDataStore();  
  if (!userData?.screens?.SSMANU?.creationAllowed) {
    return null;
  }

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
