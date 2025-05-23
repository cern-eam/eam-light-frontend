import { useEffect, useState } from "react";
import { getDocumentAttachment, getDocuments } from "../../../tools/WSDocuments";
import DocFileList from "./DocFileList";
import DocPreview from "./DocPreview";
import "./Documents.css";

const Documents = ({ code, entity }) => {
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    getDocuments(code, entity)
      .then(async (response) => {
        const documentList = response.body.data || [];

        const filteredDocs = documentList.filter((doc) => {
          const name = doc.docfilepath?.toLowerCase();
          return name && (name.endsWith(".jpg") || name.endsWith(".pdf"));
        });

        const withContent = await Promise.all(
          filteredDocs.map(async (doc) => {
            try {
              const res = await getDocumentAttachment(doc.doccode, doc.docfilepath);
              const base64 = res.body?.Result?.ResultData?.Attachment?.FILECONTENT || null;

              if (!base64) return null;

              const type = doc.docfilepath.toLowerCase().endsWith(".pdf") ? "pdf" : "jpg";

              return {
                src: `data:application/${type === "pdf" ? "pdf" : "jpeg"};base64,${base64}`,
                filename: doc.docfilepath,
                code: doc.doccode,
                desc: doc.docdescription,
                type,
              };
            } catch (err) {
              console.error("Failed to load attachment for", doc.doccode, err);
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
