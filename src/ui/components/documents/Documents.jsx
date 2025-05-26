import { useEffect, useState } from "react";
import { getDocumentAttachment, getDocuments } from "../../../tools/WSDocuments";
import DocFileList from "./DocFileList";
import DocPreview from "./DocPreview";
import "./Documents.css";
import { getFileType } from "./tools";
import useSnackbarStore from "../../../state/useSnackbarStore";

const Documents = ({ code, entity }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showNotification, showError, handleError } = useSnackbarStore();

  const onUploadSuccess = (newDoc) => {
    const type = getFileType(newDoc.docfilepath);

    const fileEntry = {
      src: `data:${type === "pdf" ? "application/pdf" : `image/${type}`};base64,${newDoc.base64}`,
      filename: newDoc.docfilepath,
      code: newDoc.doccode,
      desc: newDoc.docdescription,
      type,
    };

    setFiles((prev) => [fileEntry, ...prev]);
    setCurrentIndex(0);
  };

  const onDeleteSuccess = (deletedCode) => {
    setFiles(prev => prev.filter(file => file.code !== deletedCode));
    setCurrentIndex(0);
    showNotification("Document successfully deleted")
  };

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    getDocuments(code, entity)
      .then(async (response) => {
        const documentList = response.body.data || [];

        const filteredDocs = documentList.filter((doc) => {
          const name = doc.docfilepath?.toLowerCase();
          return name && (
            name.endsWith(".jpg") ||
            name.endsWith(".jpeg") ||
            name.endsWith(".png") ||
            name.endsWith(".pdf")
          );
        });

        const withContent = await Promise.all(
          filteredDocs.map(async (doc) => {
            try {
              const res = await getDocumentAttachment(doc.doccode, doc.docfilepath);
              const base64 = res.body?.Result?.ResultData?.Attachment?.FILECONTENT || null;

              if (!base64) return null;

              const type = getFileType(doc.docfilepath)
              return {
                src: `data:${type === "pdf" ? "application/pdf" : `image/${type}`};base64,${base64}`,
                filename: doc.docfilepath,
                code: doc.doccode,
                desc: doc.docdescription,
                type,
              };
            } catch (err) {
              handleError(err)
              return null;
            }
          })
        );

        const valid = withContent.filter(Boolean);
        setFiles(valid);
        setCurrentIndex(0);
      })
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <div className="doc-layout">
      <DocFileList
        files={files}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        code={code}
        entity={entity}
        onUploadSuccess={onUploadSuccess}
        onDeleteSuccess={onDeleteSuccess}
        loading={loading}
      />

    <div className="doc-preview">
      {files.length && !loading ? (
        <DocPreview file={files[currentIndex]} />
      ) : (
        <div style={{ fontStyle: 'italic', color: '#888' }}>
          {loading ? 'Loading Documents ...' : 'No documents found.'}
        </div>
      )}
    </div>
    </div>
  );


};

export default Documents;
