import React, {Component} from 'react';
import queryString from "query-string"
import ResizableIframe from "./ResizableIframe";
import { withCernMode } from "../CERNMode";

class ComponentIframe extends Component {
    docLightStyle = {
        width: "1px",
        minWidth: "100%",
        border: "none",
    }

    render() {
        const { url, options,  ...params } = this.props;

        return (
            <ResizableIframe
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    ...options
                }}
                src={`${url}?${queryString.stringify(params)}`}
                style={this.docLightStyle}/>
        )
    }
}

export default withCernMode(ComponentIframe);
