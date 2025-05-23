import { useEffect, useState } from "react";
import { getDocumentAttachment, getEquipmentDocuments, getWorkOrderDocuments } from "../../../tools/WSDocuments";
import DocFileList from "./DocFileList";
import DocPreview from "./DocPreview";
import "./Documents.css";

const Documents = ({ code, organization, entity, mrc }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    const fetchDocuments =
      entity === "OBJ"
        ? getEquipmentDocuments
        : entity === "EVNT"
        ? getWorkOrderDocuments
        : null;

    if (!fetchDocuments) return;

    setLoading(true);
    fetchDocuments(code, organization, mrc)
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
                desc: doc.doc_desc,
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

  if (loading) return <div>Loading...</div>;
  if (!files.length) return <div>No JPG or PDF documents found.</div>;

  return (
    <div className="doc-layout">
      <DocFileList files={files} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      <DocPreview file={files[currentIndex]} />
    </div>
  );
};

export default Documents;
