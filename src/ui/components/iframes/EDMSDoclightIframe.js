import React, {Component} from 'react';
import queryString from "query-string"
import ResizableIframe from "./ResizableIframe";
import { withCernMode } from "../CERNMode";

class EDMSDoclightIframe extends Component {
    docLightStyle = {
        width: "1px",
        minWidth: "100%",
        border: "none",
        boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
    }

    render() {
        const { objectType, objectID, mode, profile, collapsible, title } = this.props;
        const queryParams = queryString.stringify({
            objectType,
            objectID,
            mode,
            profile,
            title,
            collapsible,
        })
        const src = `${this.props.edmsdoclightURL}?${queryParams}`

        return (
            <ResizableIframe
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    heightCalculationMethod: 'bodyOffset'
                }}
                src={src}
                style={this.docLightStyle}/>
        )
    }
}

EDMSDoclightIframe.defaultProps = {
    mode: 'write',
    profile: 'EAMLIGHT',
    collapsible: false,
    title: '',
}

export default withCernMode(EDMSDoclightIframe);
