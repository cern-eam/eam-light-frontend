import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ResizableIframe from "./ResizableIframe";
import { withCernMode } from '../CERNMode'

const functionToEAMLightPageMapping = {
    'OSOBJA': '/asset',
    'OSOBJS': '/system',
    'OSOBJP': '/position',
    'OSOBJL': '/location'
}

const eqGraphStyle = {
    width: "100%",
    border: "none",
    height: "500px",
    boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
}

const MESSAGE_EVENT_KEY = "message";

const EquipmentGraphIframe = (props) => {
    const { equipmentGraphURL, equipmentCode } = props;
    const src = `${equipmentGraphURL}?equipmentno=${equipmentCode}`;
    const history = useHistory();
    const [displayIframe, setDisplayIFrame] = useState(false);

    const messageHandler = useCallback((event) => {
        if (!event || !event.data) return;
        let data = {};

        try {
            data = JSON.parse(event.data);
        } catch (e) {
            return;
        }
        
        if (data.messageName === "directSelect") {
            const link = `${functionToEAMLightPageMapping[data.systemFunction]}/${data.drillbackParams.equipmentno}`
            history.push(link);
        }
    }, []);

    useEffect(() => {
        window.addEventListener(MESSAGE_EVENT_KEY, messageHandler);
        return () => window.removeEventListener(MESSAGE_EVENT_KEY, messageHandler);
    }, []);

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