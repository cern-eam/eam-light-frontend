import { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { pickSingleFile, uploadAndAttachDocument } from "./tools";
import useSnackbarStore from "../../../state/useSnackbarStore";

const MAX_FILE_SIZE_MB = 20;

const NewDocumentButton = ({ code, entity, onUploadSuccess, disabled }) => {
  const { showNotification, showError, handleError } = useSnackbarStore();
  const [isUploading, setIsUploading] = useState(false);

  const handleButtonClick = async () => {
    setIsUploading(true);
    try {
      const file = await pickSingleFile();

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        showError(`File too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      const uploaded = await uploadAndAttachDocument(file, entity, code);
      onUploadSuccess(uploaded);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      fullWidth
      onClick={handleButtonClick}
      style={{ marginBottom: "12px", color: "white" }}
      disabled={disabled || isUploading}
    >
      NEW DOCUMENT
    </Button>
  );
};

export default NewDocumentButton;
