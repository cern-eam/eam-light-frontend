import Comments from "eam-components/dist/ui/components/comments/Comments";
import React, { useState } from "react";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { ENTITY_TYPE } from "../../../components/Toolbar.jsx";
import EntityRegions from "../../../components/entityregions/EntityRegions.jsx";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping.js";
import {
    getTabAvailability,
    getTabInitialVisibility,
    renderLoading,
} from "../../EntityTools.jsx";
import useEntity from "@/hooks/useEntity";
import WSNCRs from "../../../../tools/WSNCRs.js";
import { isClosedEquipment } from "../EquipmentTools.js";
import Rule from "@mui/icons-material/Rule";
import DescriptionIcon from "@mui/icons-material/Description";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import NCRGeneral from "./NCRGeneral.jsx";
import { isRegionAvailable, layoutPropertiesMap } from "./NCRTools.js";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields.jsx";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EDMSDoclightIframeContainer from "@/ui/components/iframes/EDMSDoclightIframeContainer";
import Observations from "./observations/Observations";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import WSWorkorders from "../../../../tools/WSWorkorders.js";
import WSEquipment from "../../../../tools/WSEquipment.js";

const NCR = () => {
    const [statuses, setStatuses] = useState([]);

    const {
        screenLayout: ncrLayout,
        entity: ncr,
        setEntity: setNCR,
        loading,
        readOnly,
        isModified,
        screenPermissions,
        screenCode,
        userData,
        applicationData,
        newEntity,
        commentsComponent,
        isHiddenRegion,
        getHiddenRegionState,
        getUniqueRegionID,
        showEqpTree,
        toggleHiddenRegion,
        setRegionVisibility,
        newHandler,
        saveHandler,
        deleteHandler,
        copyHandler,
        handleError,
        updateEntityProperty: updateNCRProperty,
        register,
        showNotification,
        showWarning
    } = useEntity({
        WS: {
            create: WSNCRs.createNonConformity,
            read: WSNCRs.getNonConformity,
            update: WSNCRs.updateNonConformity,
            delete: WSNCRs.deleteNonConformity,
            new: WSNCRs.initNonConformity,
        },
        postActions: {
            read: postRead,
            new: postInit,
        },
        handlers: {
            equipmentCode: onChangeEquipment,
          },
        isReadOnlyCustomHandler: isClosedEquipment,
        entityCode: "OBJ",
        entityDesc: "NCR",
        entityURL: "/ncr/",
        entityCodeProperty: "code",
        screenProperty: "ncrScreen",
        layoutProperty: "ncrLayout",
        layoutPropertiesMap: layoutPropertiesMap,
    });

    function postInit() {
        
    }

    function postRead() {
        readStatuses("", "", true);
    }

    const readStatuses = (status, type, newwo) => {
        WSWorkorders.getWorkOrderStatusValues(
            userData.eamAccount.userGroup,
            status,
            type,
            newwo
        )
            .then((response) => setStatuses(response.body.data))
            .catch(console.error);
    };

    function onChangeEquipment(equipmentCode) {
        
        if (!equipmentCode) {
          return;
        }
    
        WSEquipment.getEquipment(equipmentCode)
          .then((response) => {
            const equipment = response.body.data;
    
            setNCR((oldNCR) => ({
              ...oldNCR,
              department: equipment.departmentCode,
              location: equipment.hierarchyLocationCode,
            }));
          })
          .catch(console.error);
      }

    const getRegions = () => {
        const tabs = ncrLayout.tabs;

        const commonProps = {
            newEntity,
            ncrLayout,
            updateNCRProperty,
            register,
            userGroup: userData.eamAccount.userGroup,
            readOnly,
            showWarning,
        };

        return [
            {
                id: "GENERAL",
                label: "General",
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => (
                    <NCRGeneral
                        showNotification={showNotification}
                        {...commonProps}
                        statuses={statuses}
                        userData={userData}
                        screenCode={screenCode}
                        screenPermissions={screenPermissions}
                        ncr={ncr}
                    />
                ),
                column: 1,
                order: 1,
                summaryIcon: DescriptionIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(
                    tabs,
                    TAB_CODES.RECORD_VIEW
                ),
            },
            {
                id: "EDMSDOCUMENTS",
                label: "EDMS Documents",
                isVisibleWhenNewEntity: false,
                maximizable: true,
                render: () => (
                    <EDMSDoclightIframeContainer
                        objectType="NOCF"
                        objectID={ncr.code}
                        url={applicationData.EL_DOCLI}
                    />
                ),
                RegionPanelProps: {
                    detailsStyle: { padding: 0 },
                },
                column: 2,
                order: 5,
                summaryIcon: FunctionsRoundedIcon,
                initialVisibility: true,
            },
            {
                id: "COMMENTS",
                label: "Comments",
                isVisibleWhenNewEntity: false,
                maximizable: false,
                render: () => (
                    <Comments
                        ref={(comments) =>
                            (commentsComponent.current = comments)
                        }
                        entityCode="NOCF"
                        entityKeyCode={!newEntity ? ncr.code : undefined}
                        entityOrganization={ncr.organizationCode}
                        handleError={handleError}
                        userCode={userData.eamAccount.userCode}
                        allowHtml={true}
                        disabled={readOnly}
                    />
                ),
                RegionPanelProps: {
                    detailsStyle: { padding: 0 },
                },
                column: 2,
                order: 9,
                summaryIcon: DriveFileRenameOutlineIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
                initialVisibility: getTabInitialVisibility(
                    tabs,
                    TAB_CODES.COMMENTS
                ),
            },
            {
                id: "USERDEFINEDFIELDS",
                label: "User Defined Fields",
                isVisibleWhenNewEntity: true,
                maximizable: false,
                render: () => (
                    <UserDefinedFields
                        entityLayout={ncrLayout.fields}
                        {...commonProps}
                    />
                ),
                column: 2,
                order: 10,
                summaryIcon: AssignmentIndIcon,
                ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
                initialVisibility: getTabInitialVisibility(
                    tabs,
                    TAB_CODES.RECORD_VIEW
                ),
            },
            {
                id: "OBSERVATIONS",
                label: "Observations",
                isVisibleWhenNewEntity: false,
                maximizable: false,
                customVisibility: () =>
                    isRegionAvailable(
                        TAB_CODES.OBSERVATIONS,
                        commonProps.ncrLayout
                    ),
                render: () => (
                    <Observations
                        ncrCode={ncr.code}
                        observationFields={tabs[TAB_CODES.OBSERVATIONS].fields}
                        disabled={readOnly}
                        statuses={statuses}
                    />
                ),
                column: 2,
                order: 11,
                summaryIcon: AssignmentIndIcon, // TODO: Change icon
                ignore: !getTabAvailability(tabs, TAB_CODES.OBSERVATIONS),
                initialVisibility: getTabInitialVisibility(
                    tabs,
                    TAB_CODES.OBSERVATIONS
                ),
            },
        ];
    };

    if (!ncr || !ncrLayout) {
        return renderLoading("Reading NCR ...")
    }

    return (
        <BlockUi
            tag="div"
            blocking={loading}
            style={{ height: "100%", width: "100%" }}
        >
            <EamlightToolbar
                isModified={isModified}
                newEntity={newEntity}
                entityScreen={screenPermissions}
                entityName="NCR"
                entityKeyCode={ncr.code}
                organization={ncr.organizationCode}
                saveHandler={saveHandler}
                newHandler={newHandler}
                deleteHandler={deleteHandler}
                toolbarProps={{
                    entityDesc: "NCR",
                    entity: ncr,
                    // postInit: this.postInit.bind(this),
                    // setLayout: this.setLayout.bind(this),
                    newEntity,
                    applicationData: applicationData,
                    extendedLink: applicationData.EL_ASSLI,
                    screencode: screenCode,
                    copyHandler,
                    entityType: ENTITY_TYPE.NCR,
                    screens: screenPermissions,
                    workorderScreencode: userData.workOrderScreen,
                }}
                width={730}
                entityIcon={<Rule style={{ height: 18 }} />}
                toggleHiddenRegion={toggleHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                regions={getRegions()}
                isHiddenRegion={isHiddenRegion}
                getHiddenRegionState={getHiddenRegionState}
            />
            <EntityRegions
                showEqpTree={showEqpTree}
                regions={getRegions()}
                isNewEntity={newEntity}
                isHiddenRegion={isHiddenRegion}
                getUniqueRegionID={getUniqueRegionID}
                setRegionVisibility={setRegionVisibility}
                getHiddenRegionState={getHiddenRegionState}
            />
        </BlockUi>
    );
};

export default NCR;
