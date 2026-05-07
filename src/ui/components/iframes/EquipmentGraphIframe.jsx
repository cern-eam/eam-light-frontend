import { useState } from 'react';
import ResizableIframe from "./ResizableIframe";
import { withCernMode } from '../CERNMode'

const eqGraphStyle = {
    width: "100%",
    border: "none",
    height: "500px",
    //boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
}

const EquipmentGraphIframe = (props) => {
    const { equipmentGraphURL, equipmentCode } = props;
    const src = `${equipmentGraphURL}?equipmentno=${equipmentCode}`;
    const [displayIframe, setDisplayIFrame] = useState(false);

    // Needed in order to render graph centered
    setTimeout(() => setDisplayIFrame(true), 0);

    return (
        displayIframe &&
            <ResizableIframe
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false,
                    heightCalculationMethod: 'bodyOffset',
                    id: 'equipmentGraph',
                    sizeHeight: false
                }}
                src={src}
                style={eqGraphStyle} />
    )
}

export default withCernMode(EquipmentGraphIframe);