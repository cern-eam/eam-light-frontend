import React from 'react';
import queryString from 'query-string';
import ResizableIFrame from 'ui/components/iframes/ResizableIframe';

const iframeStyle = {
    width: "1px",
    minWidth: "100%",
    border: "none",
    height: "100%",
}

const Report = () => {
    const urlParameters = queryString.parse(window.location.search);
    const reportUrl = urlParameters.url;

    return (
        <ResizableIFrame
            iframeResizerOptions={{
                scrolling: true,
                checkOrigin: false, // CHECK: disable this option or list allowed origins
            }}
            src={reportUrl}
            style={iframeStyle}
        />
    );
};

export default Report;
