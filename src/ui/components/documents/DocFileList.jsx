import { useState } from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UploadButton from './NewDocumentButton';
import { detachDocument } from '../../../tools/WSDocuments'; // Adjust path as needed
import NewDocumentButton from './NewDocumentButton';

const DocFileList = ({ files, currentIndex, setCurrentIndex, code, entity, loading, onUploadSuccess, onDeleteSuccess }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuFileCode, setMenuFileCode] = useState(null);

  const handleMenuOpen = (event, fileCode) => {
    setMenuAnchor(event.currentTarget);
    setMenuFileCode(fileCode);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuFileCode(null);
  };

  const handleDelete = async () => {
    try {
      await detachDocument(code, menuFileCode, entity);
      onDeleteSuccess(menuFileCode); // Reload the list
    } catch (error) {
      console.error(`Failed to delete ${menuFileCode}`, error);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <div className="doc-sidebar">
      {(entity === "EVNT" || entity === "PART") && (
        <NewDocumentButton code={code} entity={entity} onUploadSuccess={onUploadSuccess} disabled={loading}/>
      )}

      <ul className="doc-filelist">
        {files.map((file, index) => (
          <li
            key={file.code}
            className={`doc-thumb ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          >
            {file.type === "pdf" ? (
              <div className="doc-thumb-icon">
                <PictureAsPdfIcon style={{ fontSize: 48, color: '#8c8a8a' }} />
              </div>
            ) : (
              <img src={file.src} alt={file.filename} className="doc-thumb-img" />
            )}
            <div className="doc-thumb-label"  >
              <span>{file.code}</span>
              <IconButton
                style={{marginRight: -8}}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, file.code);
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
          </li>
        ))}
      </ul>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Remove Document Link</MenuItem>
      </Menu>
    </div>
  );
};

export default DocFileList;
