import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import { Button } from "@mui/material";

const DocFileList = ({ files, currentIndex, setCurrentIndex }) => (
  <div className="doc-sidebar">
    <Button
      variant="contained"
      startIcon={<AddIcon  />}
      fullWidth
      onClick={() => alert("Add file action triggered")}
      style={{ marginBottom: '12px', color: "white" }}
    >
       NEW DOCUMENT
    </Button>

    <ul className="doc-filelist">
      {files.map((file, index) => (
        <li
          key={file.code}
          className={`doc-thumb ${index === currentIndex ? "active" : ""}`}
          onClick={() => setCurrentIndex(index)}
        >
          {file.type === "jpg" ? (
            <img src={file.src} alt={file.filename} className="doc-thumb-img" />
          ) : (
            <div className="doc-thumb-icon">
              <PictureAsPdfIcon style={{ fontSize: 48, color: '#8c8a8a' }} />
            </div>
          )}
          <div className="doc-thumb-label">{file.code}</div>
        </li>
      ))}
    </ul>
  </div>
);

export default DocFileList;
