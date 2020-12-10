import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ResizableIframe from "./ResizableIframe";


const functionToEAMLightPageMapping = {
    'OSOBJA': 'asset',
    'OSOBJS': 'system',
    'OSOBJP': 'position',
    'OSOBJL': 'location'
}

const eqGraphStyle = {
    width: "100%",
    border: "none",
    height: "500px",
    boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)"
}



const EquipmentGraphIframe = (props) => {
    const {equipmentGraphURL, equipmentCode} = props;
    const src = `${equipmentGraphURL}?equipmentno=${equipmentCode}`;
    const history = useHistory();
    const [displayIframe, setDisplayIFrame] = useState(false)

    const eventListeners = {
        'message': [
            (event) => {
                const data = JSON.parse(event.data);
                if(data.messageName === "directSelect") {
                    const link = `../../${functionToEAMLightPageMapping[data.systemFunction]}/${data.drillbackParams.equipmentno}`
                    history.push(link);
                }
            }
        ]
    }

    setTimeout(() => setDisplayIFrame(true), 1500);

    return (
        displayIframe &&
            <ResizableIframe
                iframeResizerOptions={{
                    scrolling: false,
                    checkOrigin: false, // CHECK: disable this option or list allowed origins
                    heightCalculationMethod: 'bodyOffset',
                    id: 'equipmentGraph',
                    sizeHeight: false
                }}
                src={src}
                style={eqGraphStyle}
                eventListeners={eventListeners}/>
    )
}

export default EquipmentGraphIframe;