const DocPreview = ({ file }) => (
  <div className="doc-preview">
    {file.type !== "pdf" ? (
      <img src={file.src} alt={file.filename} className="doc-image" />
    ) : (
      <iframe src={file.src} title={file.filename} className="doc-pdf" />
    )}
  </div>
);

export default DocPreview;
