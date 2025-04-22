import { useEffect, useState } from "react";
import { getEquipmentDocuments } from "../../../../tools/WSEquipment";
import { getDocumentAttachment } from "../../../../tools/WSDocuments";
import "./Documents.css";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const Documents = ({ code, organization }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    getEquipmentDocuments(code, organization)
      .then(async (response) => {
        const documentList = response.body.data || [];

        const filteredDocs = documentList.filter((doc) => {
          const name = doc.doc_filename?.toLowerCase();
          return name && (name.endsWith(".jpg") || name.endsWith(".pdf"));
        });

        const withContent = await Promise.all(
          filteredDocs.map(async (doc) => {
            try {
              const res = await getDocumentAttachment(doc.doc_code, doc.doc_filename);
              const base64 = res.body?.Result?.ResultData?.Attachment?.FILECONTENT || null;

              if (!base64) return null;

              const type = doc.doc_filename.toLowerCase().endsWith(".pdf") ? "pdf" : "jpg";

              return {
                src: `data:application/${type === "pdf" ? "pdf" : "jpeg"};base64,${base64}`,
                filename: doc.doc_filename,
                code: doc.doc_code,
                type,
              };
            } catch (err) {
              console.error("Failed to load attachment for", doc.doc_code, err);
              return null;
            }
          })
        );

        const valid = withContent.filter(Boolean);
        setFiles(valid);
        setCurrentIndex(0);
      })
      .finally(() => setLoading(false));
  }, [code, organization]);

  const current = files[currentIndex];

  if (loading) return <div>Loading...</div>;
  if (!files.length) return <div>No JPG or PDF documents found.</div>;

  return (
    <div className="doc-layout">
      <div className="doc-sidebar">
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
                  <PictureAsPdfIcon style={{ fontSize: 48, color: '#rgb(140 138 138)' }} />
                </div>
              )}
            <div className="doc-thumb-label">{file.filename}</div>
          </li>
        ))}
      </ul>

      </div>

      <div className="doc-preview">
        {current.type === "jpg" ? (
          <img src={current.src} alt={current.filename} className="doc-image" />
        ) : (
          <iframe
            src={current.src}
            title={current.filename}
            className="doc-pdf"
          />
        )}
      </div>
    </div>
  );
};

export default Documents;
