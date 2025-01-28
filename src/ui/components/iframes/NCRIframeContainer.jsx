/* eslint-disable react/prop-types */
import ComponentIframe from './ComponentIframe';
import AssetNCRs from '../../pages/equipment/components/EquipmentNCRs';


const NCRIframeContainer = (props) => {
    const defaultProps = {
        mode: 'write',
        profile: 'EAMLIGHT',
        creationMode: 'NCR',
        options: {
            heightCalculationMethod: 'taggedElement',
        },
        ...props // Allow additional props to override defaults
    };

    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;  
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    return (
        isValidHttpUrl(props?.url) ? 
            <ComponentIframe {...defaultProps} />
        : (
            <AssetNCRs equipment={props.equipmentCode} />
        )
    )
};

export default NCRIframeContainer;
