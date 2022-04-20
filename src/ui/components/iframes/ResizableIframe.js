import React from 'react';
import IframeResizer from 'iframe-resizer-react'

const ResizableIFrame = ({ 
    src,
    id, 
    className, 
    style,
    iframeResizerOptions = {} 
}) => (
    <IframeResizer
        {...iframeResizerOptions}
        autoResize
        src={src}
        id={id}
        className={className}
        style={style}
    />
);

export default ResizableIFrame;