import React, { Component } from 'react';
import queryString from "query-string"
import ResizableIframe from "./ResizableIframe";

class EDMSDoclightIframe extends Component {
    docLightStyle = {
        width: "100%",
        border: "none",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
    }

    render() {
        const { objectType, objectID, mode, profile } = this.props;
        const queryParams = queryString.stringify({
            objectType,
            objectID,
            mode,
            profile
        })
        const src = `${this.props.edmsdoclightURL}?${queryParams}`

        return (
            <ResizableIframe
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    heightCalculationMethod: 'bodyScroll'
                }}
                src={src}
                style={this.docLightStyle}/>
        )
    }
}

EDMSDoclightIframe.defaultProps = {
    mode: 'write',
    profile: 'EAMLIGHT'
}

export default EDMSDoclightIframe;
