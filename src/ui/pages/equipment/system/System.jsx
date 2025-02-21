import React, { useState } from "react";
import EquipmentHistory from "../components/EquipmentHistory.jsx";
import CustomFields from "eam-components/dist/ui/components/customfields/CustomFields";
import WSEquipment from "../../../../tools/WSEquipment";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import SystemGeneral from "./SystemGeneral";
import SystemDetails from "./SystemDetails";
import SystemHierarchy from "./SystemHierarchy";
import Comments from "eam-components/dist/ui/components/comments/Comments";
import UserDefinedFields from "../../../components/userdefinedfields/UserDefinedFields";
import EquipmentPartsAssociated from "../components/EquipmentPartsAssociated";
import EquipmentWorkOrders from "../components/EquipmentWorkOrders";
import EDMSDoclightIframeContainer from "../../../components/iframes/EDMSDoclightIframeContainer";
import { ENTITY_TYPE } from "../../../components/Toolbar";
import EntityRegions from "../../../components/entityregions/EntityRegions";
import EquipmentGraphIframe from "../../../components/iframes/EquipmentGraphIframe";
import { isCernMode } from "../../../components/CERNMode";
import { TAB_CODES } from "../../../components/entityregions/TabCodeMapping";
import {
  getTabAvailability,
  getTabInitialVisibility,
  getTabGridRegions,
  renderLoading,
} from "../../EntityTools";
import useEntity from "@/hooks/useEntity";
import {
  isClosedEquipment,
  systemLayoutPropertiesMap,
} from "../EquipmentTools";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { SystemIcon, PartIcon } from "eam-components/dist/ui/components/icons";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import FunctionsRoundedIcon from "@mui/icons-material/FunctionsRounded";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShareIcon from "@mui/icons-material/Share";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Variables from "../components/Variables";
import EamlightToolbar from "../../../components/EamlightToolbar.jsx";
import { eq } from "lodash";

const customTabGridParamNames = [
  "equipmentno",
  "obj_code",
  "main_eqp_code",
  "OBJ_CODE",
  "object",
  "puobject",
];

const System = () => {

  const {
    screenLayout: systemLayout,
    entity: equipment,
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
    getUniqueRegionID,
    showEqpTree,
    updateEquipmentTreeData,
    setRegionVisibility,
    newHandler,
    saveHandler,
    deleteHandler,
    copyHandler,
    updateEntityProperty: updateEquipmentProperty,
    register,
    handleError,
    showError,
    showNotification,
  } = useEntity({
    WS: {
      create: WSEquipment.createEquipment,
      read: WSEquipment.getEquipment,
      update: WSEquipment.updateEquipment,
      delete: WSEquipment.deleteEquipment,
      new: WSEquipment.initEquipment.bind(null, "S"), // TODO: again we have extra arguments, does it perform basic functions without them?
    },
    postActions: {
      read: postRead,
      new: postInit,
    },
    isReadOnlyCustomHandler: isClosedEquipment,
    entityCode: "OBJ",
    entityDesc: "System",
    entityURL: "/system/",
    entityCodeProperty: "code",
    screenProperty: "systemScreen",
    layoutProperty: "systemLayout",
    layoutPropertiesMap: systemLayoutPropertiesMap,
  });

  function postInit() {
    updateEquipmentTreeData({equipment: null});
  }

  function postRead(equipment) {
    if (!showEqpTree) {
      updateEquipmentTreeData({equipment});
    }
  }

  const getEDMSObjectType = (equipment) => {
    if (
      equipment.systemTypeCode === "S" &&
      ["B", "M"].includes(equipment.typeCode)
    ) {
      return "A";
    }
    return "X";
  };

  const getRegions = () => {
    const tabs = systemLayout.tabs;

    let commonProps = {
      equipment,
      newEntity,
      systemLayout,
      userGroup: userData.eamAccount.userGroup,
      updateEquipmentProperty,
      register,
      readOnly,
    };

    return [
      {
        id: "GENERAL",
        label: "General",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <SystemGeneral
            showNotification={showNotification}
            {...commonProps}
            userData={userData}
            screenCode={screenCode}
            screenPermissions={screenPermissions}
          />
        ),
        column: 1,
        order: 1,
        summaryIcon: DescriptionIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "DETAILS",
        label: "Details",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <SystemDetails {...commonProps} />,
        column: 1,
        order: 2,
        summaryIcon: AssignmentIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "VARIABLES",
        label: "Variables",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <Variables {...commonProps} />,
        column: 1,
        order: 10,
        summaryIcon: ClearAllIcon,
        ignore: systemLayout.fields.block_9.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "HIERARCHY",
        label: "Hierarchy",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => <SystemHierarchy {...commonProps} />,
        column: 1,
        order: 15,
        summaryIcon: AccountTreeRoundedIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "WORKORDERS",
        label: "Work Orders",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: ({ panelQueryParams }) => (
          <EquipmentWorkOrders
            equipmentcode={equipment.code}
            defaultFilter={panelQueryParams.defaultFilter}
            equipmenttype="S"
          />
        ),
        column: 1,
        order: 20,
        summaryIcon: ContentPasteIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      {
        id: "HISTORY",
        label: "History",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        render: () => <EquipmentHistory equipmentcode={equipment.code} />,
        column: 1,
        order: 25,
        summaryIcon: ManageHistoryIcon,
        ignore: !isCernMode || !getTabAvailability(tabs, TAB_CODES.WORKORDERS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.WORKORDERS),
      },
      {
        id: "PARTS",
        label: "Parts",
        isVisibleWhenNewEntity: false,
        maximizable: false,
        render: () => (
          <EquipmentPartsAssociated
            equipmentcode={equipment.code}
            parentScreen={screenPermissions.parentScreen}
          />
        ),
        column: 1,
        order: 30,
        summaryIcon: PartIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.PARTS_ASSOCIATED),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.PARTS_ASSOCIATED
        ),
      },
      {
        id: "EDMSDOCUMENTS",
        label: "EDMS Documents",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EDMSDoclightIframeContainer
            objectType={getEDMSObjectType(equipment)}
            objectID={equipment.code}
            url={applicationData.EL_DOCLI}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 7,
        summaryIcon: FunctionsRoundedIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EDMS_DOCUMENTS_SYSTEMS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EDMS_DOCUMENTS_SYSTEMS
        ),
      },
      {
        id: "COMMENTS",
        label: "Comments",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <Comments
            ref={(comments) => (commentsComponent.current = comments)}
            entityCode="OBJ"
            entityKeyCode={!newEntity ? equipment.code : undefined}
            userCode={userData.eamAccount.userCode}
            handleError={handleError}
            allowHtml={true}
            entityOrganization={equipment.organization}
            disabled={readOnly}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 8,
        summaryIcon: DriveFileRenameOutlineIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.COMMENTS),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.COMMENTS),
      },
      {
        id: "USERDEFINEDFIELDS",
        label: "User Defined Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <UserDefinedFields
            entityLayout={systemLayout.fields}
            exclusions={["udfchar45"]}
            {...commonProps}
          />
        ),

        column: 2,
        order: 9,
        summaryIcon: AssignmentIndIcon,
        ignore: !getTabAvailability(tabs, TAB_CODES.RECORD_VIEW),
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "CUSTOMFIELDS",
        label: "Custom Fields",
        isVisibleWhenNewEntity: true,
        maximizable: false,
        render: () => (
          <CustomFields
            entityCode="OBJ"
            entityKeyCode={equipment.code}
            classCode={equipment.classCode}
            customFields={equipment.customField}
            register={register}
          />
        ),
        column: 2,
        order: 20,
        summaryIcon: ListAltIcon,
        ignore: systemLayout.fields.block_4.attribute === "H",
        initialVisibility: getTabInitialVisibility(tabs, TAB_CODES.RECORD_VIEW),
      },
      {
        id: "EQUIPMENTGRAPH",
        label: "Equipment Graph",
        isVisibleWhenNewEntity: false,
        maximizable: true,
        render: () => (
          <EquipmentGraphIframe
            equipmentCode={equipment.code}
            equipmentGraphURL={applicationData.EL_EQGRH}
          />
        ),
        RegionPanelProps: {
          detailsStyle: { padding: 0 },
        },
        column: 2,
        order: 25,
        summaryIcon: ShareIcon,
        ignore:
          !isCernMode ||
          !getTabAvailability(tabs, TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS),
        initialVisibility: getTabInitialVisibility(
          tabs,
          TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS
        ),
      },
      ...getTabGridRegions(
        applicationData,
        systemLayout.customGridTabs,
        customTabGridParamNames,
        screenCode,
        equipment.code
      ),
    ];
  };

  if (!equipment || !systemLayout) {
    return renderLoading("Reading System ...")
  }

  return (
    <BlockUi
      tag="div"
      blocking={loading}
      style={{ width: "100%", height: "100%" }}
    >
      <EamlightToolbar
        isModified={isModified}
        newEntity={newEntity}
        entityScreen={screenPermissions}
        entityName="System"
        entityKeyCode={equipment.code}
        organization={equipment.organization}
        saveHandler={saveHandler}
        newHandler={newHandler}
        deleteHandler={deleteHandler}
        toolbarProps={{
          entityDesc: "System", // TODO:
          entity: equipment,
          // postInit: this.postInit.bind(this),
          // setLayout: this.setLayout.bind(this),
          newEntity,
          applicationData: applicationData,
          extendedLink: applicationData.EL_SYSLI,
          screencode: screenCode,
          copyHandler,
          entityType: ENTITY_TYPE.EQUIPMENT,
          screens: userData.screens,
          workorderScreencode: userData.workOrderScreen,
        }}
        width={730}
        entityIcon={<SystemIcon style={{ height: 18 }} />}
        getUniqueRegionID={getUniqueRegionID}
        regions={getRegions()}
        isHiddenRegion={isHiddenRegion}
        setRegionVisibility={setRegionVisibility}
      />
      <EntityRegions
        showEqpTree={showEqpTree}
        regions={getRegions()}
        isNewEntity={newEntity}
        getUniqueRegionID={getUniqueRegionID}
        isHiddenRegion={isHiddenRegion}
        setRegionVisibility={setRegionVisibility}
      />
    </BlockUi>
  );
};

export default System;
