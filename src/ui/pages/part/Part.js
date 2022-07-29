import React, { useEffect } from 'react';
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
import PartTools from "./PartTools";
import {PartIcon} from 'eam-components/dist/ui/components/icons'
import EDMSDoclightIframeContainer from "../../components/iframes/EDMSDoclightIframeContainer";
import {ENTITY_TYPE} from '../../components/Toolbar';
import EntityRegions from "../../components/entityregions/EntityRegions";
import { TAB_CODES } from '../../components/entityregions/TabCodeMapping';
import { getTabAvailability, getTabInitialVisibility } from '../EntityTools';
import useEntity from "hooks/useEntity";

const PART = 'PART';

const Part = () => {
    // TODO: remove unused prop?
    const {screenLayout: partLayout, entity: part, loading,
        screenPermissions, screenCode, userData, applicationData, newEntity, commentsComponent,
        isHiddenRegion, getHiddenRegionState, getUniqueRegionID, showEqpTree,
        departmentalSecurity, toggleHiddenRegion, setRegionVisibility, setLayoutProperty,
        newHandler, saveHandler, deleteHandler, updateEntityProperty: updateEquipmentProperty, handleError, showError, showNotification} = useEntity({
            WS: {
                create: WSParts.createPart,
                read: WSParts.getPart,
                update: WSParts.updatePart,
                delete: WSParts.deletePart,
                new:  WSParts.initPart, // TODO: make sure we deal with extra parameters that were being passed before
            },
            postActions: {
                create: postCreate,
                read: postRead,
                new: postInit,
            },
            entityDesc: "Part",
            entityURL: "/part/",
            entityCodeProperty: "code",
            screenProperty: "partScreen",
            layoutProperty: "partLayout",
            // layoutPropertiesMap: PartTools.layoutPropertiesMap, // TODO:
        });

    // TODO: keeping for context
    // settings = {
    //     handlerFunctions: {
    //         classCode: this.onChangeClass,
    //     }
    // };

    const postInit = () => {
        //this.enableChildren(); // TODO: rm but keep for context
    }

    const postCreate = () => {
        commentsComponent.current.createCommentForNewEntity();
    }

    const postUpdate = () => {
        commentsComponent.current.createCommentForNewEntity();
    }

    const postRead = () => {
        // TODO: why was it again that we should do this here and not in empty dep useEffect. Why would we want to execute this on every read if we (from what I've seen) never change this for part again
        setLayoutProperty('showEqpTreeButton', false);
    }

    const getRegions = () => {
        const tabs = partLayout.tabs;

        const commonProps = {
            part,
            newEntity,
            partLayout,
            userData,
            updatePartProperty: updateEquipmentProperty,
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
                        updateUDFProperty={updateEquipmentProperty}
                    />
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
                        ref={comments => commentsComponent.current = comments}
                        entityCode={PART}
                        entityKeyCode={!partLayout.newEntity ? part.code : undefined}
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
                        entityCode={PART}
                        entityKeyCode={part.code}
                        classCode={part.classCode}
                        customFields={part.customField}
                        updateEntityProperty={updateEquipmentProperty}/>
                ,
                column: 2,
                order: 7,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW)
            },
        ]
    }

    if (!part) {
        return React.Fragment;
    }

    return (
        <div className="entityContainer">
            <BlockUi tag="div" blocking={loading} style={{height: "100%", width: '100%'}}>
                <EamlightToolbarContainer
                    isModified={true} // TODO: Location had a TODO here as well
                    newEntity={newEntity}
                    entityScreen={screenPermissions}
                    entityName="Part" // TODO: hardcoded (following Location example)
                    entityKeyCode={part.code}
                    saveHandler={saveHandler}
                    newHandler={newHandler}
                    deleteHandler={deleteHandler}
                    // TODO: check commented out props (following Location example)
                    toolbarProps={{
                        entity: part,
                        // postInit: this.postInit.bind(this),
                        // setLayout: this.setLayout.bind(this),
                        newEntity: newEntity,
                        applicationData: applicationData,
                        screencode: screenCode,
                        handleError: handleError,
                        showNotification: showNotification,
                        showError: showError,
                        // copyHandler: this.copyEntity.bind(this),
                        entityType: ENTITY_TYPE.PART,
                        entityDesc: "Part", // TODO: hardcoded (following Location example)
                        screens: userData.screens,
                        workorderScreencode: userData.workOrderScreen
                    }}
                    width={730}
                    entityIcon={<PartIcon style={{height: 18}}/>}
                    toggleHiddenRegion={toggleHiddenRegion}
                    getUniqueRegionID={getUniqueRegionID}
                    regions={getRegions()}
                    setRegionVisibility={setRegionVisibility}
                    isHiddenRegion={isHiddenRegion} />
                <EntityRegions
                    showEqpTree={showEqpTree}
                    regions={getRegions()}
                    isNewEntity={newEntity}
                    getHiddenRegionState={getHiddenRegionState}
                    getUniqueRegionID={getUniqueRegionID}
                    setRegionVisibility={setRegionVisibility}
                    isHiddenRegion={isHiddenRegion}/>
            </BlockUi>
        </div>
    );
}

export default Part;