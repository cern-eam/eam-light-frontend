import React from 'react';
import BlockIcon from '@material-ui/icons/Block';
import {EISIcon, RadiationIcon} from 'eam-components/dist/ui/components/icons/index'

const STATUS_KEYS = {
    OUT_OF_SERVICE: "OUT_OF_SERVICE",
    EIS: "EIS",
    RADIOACTIVE: 'RADIOACTIVE',
}

const iconStyle = {
    height: "25px",
    width: "25px"
}

const STATUSES = [
    {
        key: STATUS_KEYS.OUT_OF_SERVICE,
        shouldRender: (entity, entityType) => entity.outOfService === "true" || entity.outOfService === true,
        icon: <BlockIcon style={{color: 'red', ...iconStyle}}/>,
        description: "Out of Service" 
    },
    {
        key: STATUS_KEYS.EIS,
        shouldRender: (entity, entityType) => entityType === "equipment" && entity.userDefinedFields.udfchkbox01 === "true",
        icon: <EISIcon style={{color: 'blue', ...iconStyle}}/>,
        description: "EIS"
    },
    {
        key: STATUS_KEYS.RADIOACTIVE,
        shouldRender: (entity, entityType) => entityType === "equipment" && entity.userDefinedFields.udfchar04 === "Radioactive",
        icon: <RadiationIcon style={iconStyle}/>,
        description: "Radioactive"
    }

]

const StatusRow = (props) => {
    const generateCells = (entity, entityType) => {
        return STATUSES.map(status => {
            if (status.shouldRender(entity, entityType)) {
                return (
                    <div style={{textAlign: "center", width: "80px"}}>
                        {status.icon}
                        <div style={{fontSize: "0.75rem"}}>{status.description}</div>
                    </div>
                )
            }
        })
    }

    const icons = generateCells(props.entity, props.entityType);
    return icons.length && <div style={{width: "100%", display: "flex", ...props.style}}>{icons}</div>;
}

export default StatusRow;