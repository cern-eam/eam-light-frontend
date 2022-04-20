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
        const { edmsdoclightURL, iframeTitle, ...params } = this.props;

        return (
            <ResizableIframe
                title={iframeTitle}
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    heightCalculationMethod: 'bodyOffset'
                }}
                src={`${this.props.edmsdoclightURL}?${queryString.stringify(params)}`}
                style={this.docLightStyle}/>
        )
    }
}

export default withCernMode(ComponentIframe);
