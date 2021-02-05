import React from 'react';
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Divider from '@material-ui/core/Divider';
import { WorkorderIcon } from "eam-components/dist/ui/components/icons";
import OpenInNewIcon from 'mdi-material-ui/OpenInNew'
import {Barcode, ContentCopy, EmailOutline, Map, Printer, Domain, Camera} from 'mdi-material-ui';
import { RadiationIcon } from "eam-components/dist/ui/components/icons";
import { Link } from "react-router-dom";

export const ENTITY_TYPE = {
    WORKORDER: 'WORKORDER',
    EQUIPMENT: 'EQUIPMENT',
    PART: 'PART',
    LOCATION: 'LOCATION',
}

const VIEW_MODES = {
    MENU_ITEMS: "MENUITEMS",
    TOOLBAR_ICONS: "TOOLBARICONS",
}

export const BUTTON_KEYS = {
    COPY: "COPY",
    EMAIL: "EMAIL",
    SHOW_ON_MAP: "SHOW_ON_MAP",
    NEW_ENTITY: "NEW_ENTITY",
    LINK_TO_WORKORDER: "LINK_TO_WORKORDER",
    SHOW_IN_INFOR: "SHOW_IN_INFOR",
    PRINT: "PRINT",
    BARCODING: "BARCODING",
    OSVC: "OSVC",
    DISMAC: "DISMAC",
    TREC: "TREC",
    CREATE_WORKORDER: "CREATE_WORKORDER",
}

class Toolbar extends React.Component {

    iconStyle = {
        width: 20,
        height: 20
    };

    iconMenuStyle = {
        marginRight: 5,
        width: 20,
        height: 20
    };

    toolbarIconsStyle = {
        alignItems: "center",
        display: "flex"
    }
    
    verticalLineStyle = {
        height: 25,
        borderRight: "1px solid gray",
        margin: 5
    }

    linkStyle = {
        display: "flex",
        color: "black",
        alignItems: "center",
        textDecoration: "none"
    }

    getButtonDefinitions = () => {
        const {copyHandler, newEntity, entityDesc, applicationData, screencode, userGroup, EL_PRTWO, entity} = this.props;
        return {
            [BUTTON_KEYS.COPY] : {
                isVisible: () => true,
                onClick: copyHandler,
                isDisabled: () => newEntity,
                values: {
                    icon: <ContentCopy/>,
                    text: "Copy"
                }
            },
            [BUTTON_KEYS.EMAIL] : {
                isVisible: () => true,
                getOnClick: (entityType, entity) => {
                   const url = window.location.href.split("?")[0];
                   const id = entityType === ENTITY_TYPE.WORKORDER ? entity.number : entity.code;
                   return () => window.open(
                       `mailto:?Subject=${entityDesc} ${id}`
                       + `&body=${url}`
                   )
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <EmailOutline/>,
                    text: "Email"
                }
            },
            [BUTTON_KEYS.PRINT] : {
                isVisible: () => true,
                isDisabled: () => newEntity,
                getOnClick: (entityType, entity) => {
                    const url = EL_PRTWO + entity.number;
                    return () => {
                        const w = window.open(url, "winLov", "Scrollbars=1,resizable=1");
                        if (w.opener == null) {
                            w.opener = window.self;
                        }
                        w.focus();
                    }
                },
                values: {
                    icon: <Printer/>,
                    text: "Print"
                }
            },
            [BUTTON_KEYS.SHOW_ON_MAP] : {
                isVisible: () => true,
                getOnClick: (entityType, entity) => {
                    const LOCATION_URLS = {
                        WORKORDER: applicationData.EL_GISWO,
                        EQUIPMENT: applicationData.EL_GISEQ,
                        LOCATION: applicationData.EL_GISEQ,
                    }

                    const ID = entityType === ENTITY_TYPE.WORKORDER
                        ? entity.number : entity.code;

                    const URL = `${LOCATION_URLS[entityType]}${ID}`;
                    return () => window.open(URL, '_blank');
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <Map/>,
                    text: "Show on Map" 
                }
            },
            [BUTTON_KEYS.SHOW_IN_INFOR] : {
                isVisible: () => true,
                getOnClick: (entityType, entity) => {
                    let extendedLink; 
                    switch (entityType){
                        case ENTITY_TYPE.WORKORDER:
                            extendedLink = applicationData.EL_WOLIN
                                            .replace("&1",screencode)
                                            .replace("&2", entity.number);
                            break;
                        case ENTITY_TYPE.EQUIPMENT:
                        case ENTITY_TYPE.LOCATION:
                            extendedLink = applicationData.EL_LOCLI
                                            .replace("&1", screencode)
                                            .replace("&2", entity.code);
                            break;
                        case ENTITY_TYPE.PART:
                            extendedLink = applicationData.EL_PARTL
                                            .replace("&1", screencode)
                                            .replace("&2", entity.code);
                            break;
                    }
                    return () => window.open(extendedLink, "_blank");
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <OpenInNewIcon/>,
                    text: "Show in Infor EAM"
                }
            },
            [BUTTON_KEYS.BARCODING] : {
                isVisible: () => true,
                getOnClick: (entityType, entity) => {
                    let barcodingLink;
                    switch (entityType) {
                        case ENTITY_TYPE.PART:
                            barcodingLink = applicationData.EL_BCUR
                                            .replace("&1", screencode)
                                            .replace("&2", 'partcode')
                                            .replace("&3", entity.code);
                            break;
                        case ENTITY_TYPE.WORKORDER:
                            barcodingLink = applicationData.EL_PRTWO + entity.number;
                            break;
                        case ENTITY_TYPE.EQUIPMENT:
                            barcodingLink = applicationData.EL_BCUR
                                            .replace("&1", screencode)
                                            .replace("&2", 'equipmentno')
                                            .replace("&3", entity.code);
                            break;
                    }
                    return () => window.open(barcodingLink, '_blank')
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <Barcode/>,
                    text: "Print Barcode"
                }
            },
            [BUTTON_KEYS.OSVC] : {   
                isVisible: () => true,
                getOnClick: (entityType, entity) => {
                    const osvcLink = applicationData.EL_OSVCU
                                    .replace("{{workOrderId}}", entity.number);
                    return () => window.open(osvcLink, "_blank");
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <Domain/>,
                    text: "OSVC"
                }
            },
            [BUTTON_KEYS.DISMAC] : {
                isVisible: () =>  applicationData.EL_DMUSG &&
                                  applicationData.EL_DMUSG.includes(userGroup),
                getOnClick: (entityType, entity) => {
                    const dismacLink = applicationData.EL_DMURL
                                                        .replace("{{workOrderId}}", entity.number);
                    return () => window.open(dismacLink, "_blank");
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <Camera/>,
                    text: "DISMAC"
                } 
            },
            [BUTTON_KEYS.TREC] : { 
                isVisible: () => {
                    const { EL_TRWOC } = applicationData;
                    return (
                        EL_TRWOC &&
                        EL_TRWOC.split(",")
                            .filter(Boolean)
                            .includes(entity.classCode)
                    );
                },
                getOnClick: (entityType, entity) => {
                    const { EL_TRWRU } = applicationData;
                    const trecLink = EL_TRWRU.replace(
                        "{{workOrderId}}",
                        entity.number
                    );
                    return () => window.open(trecLink, "_blank");
                },
                isDisabled: () => newEntity,
                values: {
                    icon: <RadiationIcon/>,
                    text: "TREC"
                }
            },
            [BUTTON_KEYS.CREATE_WORKORDER] : {
                isVisible: () => true,
                getOnClick: () => {

                },
                isDisabled: () => newEntity,
                values: {
                    icon: <WorkorderIcon/>,
                    text: "Create New Work Order"
                },
                getLinkTo: (entity, entityCode) => {
                    return `/workorder?equipmentCode=${entity.code}`;
                }
            }
        };
    }

    getButtons() {
        const {entityType, renderOption, entity} = this.props; 
        let buttonKeys = [];
        switch (entityType) {
            case ENTITY_TYPE.WORKORDER:
                buttonKeys = [
                    BUTTON_KEYS.COPY, 
                    BUTTON_KEYS.EMAIL,
                    BUTTON_KEYS.PRINT, 
                    BUTTON_KEYS.SHOW_ON_MAP,
                    BUTTON_KEYS.SHOW_IN_INFOR,
                    BUTTON_KEYS.OSVC,
                    BUTTON_KEYS.DISMAC,
                    BUTTON_KEYS.TREC,
                ]
                break;
            case ENTITY_TYPE.EQUIPMENT:
                buttonKeys = [
                    BUTTON_KEYS.COPY,
                    BUTTON_KEYS.EMAIL,
                    BUTTON_KEYS.SHOW_ON_MAP,
                    BUTTON_KEYS.CREATE_WORKORDER,
                    BUTTON_KEYS.SHOW_IN_INFOR,
                    BUTTON_KEYS.BARCODING,
                ]
                break;
            case ENTITY_TYPE.PART:
                buttonKeys = [
                    BUTTON_KEYS.COPY,
                    BUTTON_KEYS.EMAIL,
                    BUTTON_KEYS.SHOW_IN_INFOR,
                    BUTTON_KEYS.BARCODING,
                ]
                break;
            case ENTITY_TYPE.LOCATION:
                buttonKeys = [
                    BUTTON_KEYS.COPY,
                    BUTTON_KEYS.EMAIL,
                    BUTTON_KEYS.SHOW_ON_MAP,
                    BUTTON_KEYS.CREATE_WORKORDER,
                    BUTTON_KEYS.SHOW_IN_INFOR,
                ]
                break;    
        }
        const buttonDefinitions = this.getButtonDefinitions();
        const buttonsRender = buttonKeys.map(buttonKey => buttonDefinitions[buttonKey])
            .map(buttonDefinition => this.generateContent({
                renderOption: renderOption, 
                buttonDefinition: buttonDefinition, 
                entityType: entityType,
                entity: entity
            }));
        return buttonsRender;   
    }

    generateContent = ({renderOption, buttonDefinition, entityType, entity}) => {
        let {isVisible, onClick, isDisabled, values, getOnClick, getLinkTo} = buttonDefinition;
        let content = null;
        if (!onClick && getOnClick) {
            onClick = getOnClick(entityType, entity);
        }
        if (isVisible()) {
            switch (renderOption) {
                case VIEW_MODES.MENU_ITEMS: 
                    content = 
                        <MenuItem
                            onClick={onClick}
                            disabled={isDisabled()}
                        >
                            {React.cloneElement(values.icon, this.iconMenuStyle)}
                            {values.text && <div>{values.text}</div>}
                        </MenuItem>
                    break;
                case VIEW_MODES.TOOLBAR_ICONS: 
                    content = 
                        <Tooltip title={values.text}>
                            <IconButton
                                onClick={onClick}
                                disabled={isDisabled()}
                            >
                                {React.cloneElement(values.icon, {style: {...this.iconStyle}})}
                            </IconButton>
                        </Tooltip>
                    break;

            }
            if (getLinkTo) {
                content = <Link to={getLinkTo(entity, entityType)} 
                                style={this.linkStyle}>
                            {content}
                        </Link>
            } 
            return content;
        }    
    }

    getToolbar = () => {
        const buttons = this.getButtons(); 
        switch (this.props.renderOption) {
            case VIEW_MODES.MENU_ITEMS:
                return  <div>
                            <Divider/>
                            {buttons}
                        </div>
            case VIEW_MODES.TOOLBAR_ICONS:
                return <div style={this.toolbarIconsStyle}>
                            <div style={this.verticalLineStyle}/>
                            {buttons}
                        </div>
        }
    }

    render() {
        return this.getToolbar();
    }

}

export default Toolbar;