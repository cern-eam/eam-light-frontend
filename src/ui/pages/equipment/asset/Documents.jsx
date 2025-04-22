import { useEffect, useState } from "react";
import { getEquipmentDocuments } from "../../../../tools/WSEquipment";
import { getDocumentAttachment } from "../../../../tools/WSDocuments";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Documents = ({ code, organization }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    getEquipmentDocuments(code, organization)
      .then(async (response) => {
        const documentList = response.body.data || [];

        const documentsWithContent = await Promise.all(
          documentList.map(async (doc) => {
            try {
              const res = await getDocumentAttachment(doc.doc_code, doc.doc_filename);
              const base64 = res.body?.Result?.ResultData?.Attachment?.FILECONTENT || null;
              return { ...doc, base64 };
            } catch (err) {
              console.error("Failed to load attachment for", doc.doc_code, err);
              return { ...doc, base64: null };
            }
          })
        );

        setDocs(documentsWithContent.filter(doc => doc.base64));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, organization]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const galleryItems = docs.map((doc) => ({
    original: `data:image/jpeg;base64,${doc.base64}`,
    thumbnail: `data:image/jpeg;base64,${doc.base64}`,
    description: `${doc.doc_code} – ${doc.doc_filename}`,
    originalAlt: doc.doc_filename,
    thumbnailAlt: doc.doc_filename
  }));

  return (
    <div>
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={true}
        showIndex={true}
      />
    </div>
  );
};

export default Documents;
