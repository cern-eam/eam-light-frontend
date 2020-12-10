import React, {Component} from 'react';
import {iframeResizer} from 'iframe-resizer';

class ResizableIFrame extends Component {

    constructor(props) {
        super(props);
        //expects an object, where keys are event types and values are arrays of functions
        if (props.eventListeners) {
            for (const [key, entry] of Object.entries(props.eventListeners)) {
                entry.forEach(eventHandler => window.addEventListener(key, eventHandler))
            }
        }
    }

    componentWillUnmount() {
        const mountedIframe = this.refs.frame.iFrameResizer
        if(!mountedIframe) return;
        mountedIframe.removeListeners();
    }

    resize = () => {
        const frame = this.refs.frame;
        const { iframeResizerOptions } = this.props;
        if (!frame) return;
        iframeResizer(iframeResizerOptions, frame);
    }

    render() {
        const { src, id, className, style, title } = this.props;
        return (
        <iframe
            ref="frame"
            title={title}
            src={src}
            id={id}
            className={className}
            style={style}
            onLoad={this.resize}
        />
        );
    }
}

ResizableIFrame.defaultProps = {
    iframeResizerOptions: {}
}

export default ResizableIFrame;