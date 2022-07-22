import React from 'react';
import EamlightToolbarContainer from './../../components/EamlightToolbarContainer';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import WSParts from '../../../tools/WSParts';
import PartGeneral from "./PartGeneral";
import UserDefinedFields from "../../components/userdefinedfields/UserDefinedFields";
import PartStock from "./PartStock";
import Comments from 'eam-components/dist/ui/components/comments/Comments';
import CustomFields from '../../components/customfields/CustomFields';
import PartWhereUsed from "./PartWhereUsed";
import PartAssets from "./PartAssets";
import Entity from '../Entity';
import PartTools from "./PartTools";
import {PartIcon} from 'eam-components/dist/ui/components/icons'
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import {ENTITY_TYPE} from '../../components/Toolbar';
import EntityRegions from "../../components/entityregions/EntityRegions";
import { isCernMode } from '../../components/CERNMode';
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';

const PART = 'PART';

class Part extends Entity {

    constructor(props) {
        super(props)
        this.props.setLayoutProperty('showEqpTreeButton', false)
    }

    //
    // SETTINGS OBJECT USED BY ENTITY CLASS
    //
    settings = {
        entity: 'part',
        entityDesc: 'Part',
        entityURL: '/part/',
        entityCodeProperty: 'code',
        entityScreen: this.props.userData.screens[this.props.userData.partScreen],
        renderEntity: this.renderPart.bind(this),
        readEntity: WSParts.getPart.bind(WSParts),
        updateEntity: WSParts.updatePart.bind(WSParts),
        createEntity: WSParts.createPart.bind(WSParts),
        deleteEntity: WSParts.deletePart.bind(WSParts),
        initNewEntity: () => WSParts.initPart(PART, this.props.location.search),
        layout: this.props.partLayout,
        layoutPropertiesMap: PartTools.layoutPropertiesMap,
        handlerFunctions: {
            classCode: this.onChangeClass,
        }
    };

    //
    // CALLBACKS FOR ENTITY CLASS
    //
    postInit() {
        this.setTrackingMethods();
        this.enableChildren();
    }

    postCreate() {
        this.comments.createCommentForNewEntity();
    }

    postUpdate() {
        this.comments.createCommentForNewEntity();
    }

    postRead(part) {
        this.setTrackingMethods();
    }

    //
    // DROP DOWN VALUES
    //
    setTrackingMethods = () => {
        WSParts.getPartTrackingMethods().then(response => {
            this.setLayout({trackingMethods: response.body.data});
        }).catch(error => {
            this.props.handleError(error);
            this.setLayout({blocking: false});
        });
    };

    getRegions = () => {
        const { partLayout, userData, handleError } = this.props;
        const { part, layout } = this.state;
        const tabs = partLayout.tabs;

        const commonProps = {
            part,
            layout,
            partLayout,
            userData,
            updatePartProperty: this.updateEntityProperty.bind(this),
            children: this.children
        };

        return [
            {
                id: 'GENERAL',
                label: 'General',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <PartGeneral
                        {...commonProps} />
                ,
                column: 1,
                order: 1,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'USERDEFINEDFIELDS',
                label: 'User Defined Fields',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <UserDefinedFields
                        fields={part.userDefinedFields}
                        entityLayout={partLayout.fields}
                        updateUDFProperty={this.updateEntityProperty}
                        children={this.children} />
                ,
                column: 1,
                order: 2,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
            {
                id: 'STOCK',
                label: 'Part Stock',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <PartStock
                        {...commonProps} />
                ,
                column: 1,
                order: 3,
                ignore: !getTabAvailability(tabs, TAB_CODES.STOCK),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.STOCK)
            },
            {
                id: 'WHEREUSED',
                label: 'Where Used',
                isVisibleWhenNewEntity: false,
                maximizable: false,
                render: () => 
                    <PartWhereUsed
                        {...commonProps} />
                ,
                column: 1,
                order: 4,
                ignore: !getTabAvailability(tabs, TAB_CODES.WHERE_USED),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WHERE_USED)
            },
            {
                id: 'ASSETS',
                label: 'Assets',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <PartAssets
                        partCode={part.code} />
                ,
                column: 1,
                order: 5,
                ignore: !getTabAvailability(tabs, TAB_CODES.WHERE_USED),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WHERE_USED)
            },
            {
                id: 'EDMSDOCUMENTS',
                label: 'EDMS Documents',
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => 
                    <EDMSDoclightIframeContainer
                        objectType={PART}
                        objectID={part.code} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 5,
                ignore: !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_PARTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.EDMS_DOCUMENTS_PARTS)
            },
            {
                id: 'COMMENTS',
                label: 'Comments',
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => 
                    <Comments
                        ref={comments => this.comments = comments}
                        entityCode={PART}
                        entityKeyCode={!layout.newEntity ? part.code : undefined}
                        userCode={userData.eamAccount.userCode}
                        handleError={handleError}
                        allowHtml={true} />
                ,
                RegionPanelProps: {
                    detailsStyle: { padding: 0 }
                },
                column: 2,
                order: 6,
                ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS)
            },
            {
                id: 'CUSTOMFIELDS',
                label: 'Custom Fields',
                isVisibleWhenNewEntity: true,
                customVisibility: () => PartTools.isRegionAvailable('CUSTOM_FIELDS', partLayout),
                maximizable: false,
                render: () => 
                    <CustomFields
                        children={this.children}
                        entityCode={PART}
                        entityKeyCode={part.code}
                        classCode={part.classCode}
                        customFields={part.customField}
                        updateEntityProperty={this.updateEntityProperty}/>
                ,
                column: 2,
                order: 7,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
        ]
    }

    renderPart() {
        const {
            applicationData,
            history,
            showEqpTree,
            toggleHiddenRegion,
            setRegionVisibility,
            userData,
            isHiddenRegion,
            getHiddenRegionState,
            getUniqueRegionID,
            showNotification,
            handleError,
            showError
        } = this.props;
        const { part, layout } = this.state;
        const regions = this.getRegions();       


        return (
            <div className="entityContainer">
                <BlockUi tag="div" blocking={layout.blocking} style={{height: "100%", width: '100%'}}>
                    <EamlightToolbarContainer
                        isModified={layout.isModified}
                        newEntity={layout.newEntity}
                        entityScreen={userData.screens[userData.partScreen]}
                        entityName={this.settings.entityDesc}
                        entityKeyCode={part.code}
                        saveHandler={this.saveHandler.bind(this)}
                        newHandler={() => history.push('/part')}
                        deleteHandler={this.deleteEntity.bind(this, part.code)}
                        toolbarProps={{ 
                            entity: part,
                            postInit: this.postInit.bind(this),
                            setLayout: this.setLayout.bind(this),
                            newEntity: layout.newEntity,
                            applicationData: applicationData,
                            screencode: userData.partScreen,
                            handleError: handleError,
                            showNotification: showNotification,
                            showError: showError,
                            copyHandler: this.copyEntity.bind(this),
                            entityType: ENTITY_TYPE.PART,
                            entityDesc: this.settings.entityDesc,
                            screens: userData.screens,
                            workorderScreencode: userData.workorderScreen
                        }}
                        width={730}
                        entityIcon={<PartIcon style={{height: 18}}/>}
                        toggleHiddenRegion={toggleHiddenRegion}
                        getUniqueRegionID={getUniqueRegionID}
                        regions={regions}
                        setRegionVisibility={setRegionVisibility}
                        isHiddenRegion={isHiddenRegion} />
                    <EntityRegions
                        showEqpTree={showEqpTree}
                        regions={regions}
                        isNewEntity={layout.newEntity} 
                        getHiddenRegionState={getHiddenRegionState}
                        getUniqueRegionID={getUniqueRegionID}
                        setRegionVisibility={setRegionVisibility}
                        isHiddenRegion={isHiddenRegion}/>
                </BlockUi>
            </div>
        );
    }
}

export default Part;