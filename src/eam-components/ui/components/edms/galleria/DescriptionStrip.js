import React from 'react';
import getEDMSFileUrl from "./EDMSUtils";

const DescriptionStrip = (file) =>
    (
        <div className="filmStripContainer">
            <h4 className="edmsContentHeader">EDMS: <a
                href={file.docUrl}
                target="_blank"
                className="edmsLink">{file.edmsId}</a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                File: <a href={file.fullPath}
                         target="_blank"
                         className="edmsLink">{file.fileName}</a>
            </h4>
            <p className="edmsTitle">Title: <a
                href={file.docUrl} target="_blank"
                className="edmsLink">{file.description}</a></p>
        </div>
    );

export default DescriptionStrip;