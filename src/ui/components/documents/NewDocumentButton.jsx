import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { pickSingleFile, uploadAndAttachDocument } from "./tools";
import useSnackbarStore from "../../../state/useSnackbarStore";

const MAX_FILE_SIZE_MB = 5;

const NewDocumentButton = ({ code, entity, onUploadSuccess, disabled }) => {
  const { showNotification, showError, handleError } = useSnackbarStore();

  const handleButtonClick = async () => {
    try {
      const file = await pickSingleFile();

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        showError(`File too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      const uploaded = await uploadAndAttachDocument(file, entity, code);
      onUploadSuccess(uploaded);
    } catch (error) {
      handleError(error)
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      fullWidth
      onClick={handleButtonClick}
      style={{ marginBottom: "12px", color: "white" }}
      disabled={disabled}
    >
      NEW DOCUMENT
    </Button>
  );
};

export default NewDocumentButton;
