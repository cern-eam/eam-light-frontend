import React from 'react';
import IframeResizer from 'iframe-resizer-react'

const ResizableIFrame = ({ 
    src,
    id, 
    className, 
    style,
    title, 
    iframeResizerOptions = {} 
}) => (
    <IframeResizer
        {...iframeResizerOptions}
        log
        autoResize
        title={title}
        src={src}
        id={id}
        className={className}
        style={style}
    />
);

export default ResizableIFrame;